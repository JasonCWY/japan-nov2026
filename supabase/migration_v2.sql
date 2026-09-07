-- ============================================================================
-- PART 1 — run first, in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Safe, no auth users needed yet.
-- ============================================================================

-- 1. checklist_items table (replaces the fragile localStorage positional array)
create table if not exists checklist_items (
  id           text primary key,
  priority     text not null check (priority in ('high','medium','low')),
  sort_order   int  not null,
  label        text not null,
  is_done      boolean not null default false,
  done_by      uuid references participants(id),
  updated_at   timestamptz not null default now()
);

insert into checklist_items (id, priority, sort_order, label) values
  ('osaka-accommodation',      'high',   1, 'Book Osaka accommodation (NTH Namba recommended — RM 184.29/pax)'),
  ('shinkansen-outbound',      'high',   2, 'Book Shinkansen × 6 (12 Nov, Shinagawa → Shin-Osaka)'),
  ('shinkansen-return',        'high',   3, 'Book Shinkansen × 6 (14 Nov, Shin-Osaka → Shinagawa)'),
  ('shinagawa-lockers',        'high',   4, 'Reserve Shinagawa Station coin lockers for Day 7 luggage'),
  ('disneysea-tickets',        'high',   5, 'Book Tokyo DisneySea tickets × 6'),
  ('usj-tickets',              'high',   6, 'Book USJ tickets × 6 + consider Express Passes'),
  ('tokyo-hotel-collection',   'medium', 7, 'Collect outstanding Tokyo hotel payments (owed to Sab1)'),
  ('gokart-booking',           'medium', 8, 'Book Street Go-Kart / Mario Kart (Akihabara or Shibuya)'),
  ('kawaguchiko-bus',          'medium', 9, 'Book highway bus × 6, Busta Shinjuku ↔ Kawaguchiko'),
  ('kawaguchiko-bike-rental',  'medium', 10, 'Research/book bicycle rental at Kawaguchiko'),
  ('halal-tokyo-plan',         'medium', 11, 'Plan halal restaurants in Tokyo'),
  ('halal-osaka-plan',         'medium', 12, 'Plan halal restaurants in Osaka'),
  ('haneda-late-night',        'medium', 13, 'Check Haneda late-night transport plan (00:15 arrival)'),
  ('fuji-weather-contingency', 'medium', 14, 'Confirm Mt Fuji weather contingency / day-swap plan'),
  ('passport-validity',        'low',    15, 'Ensure all passports valid 6+ months beyond 15 Nov 2026'),
  ('offline-maps',             'low',    16, 'Download Google Maps offline (Tokyo & Osaka)'),
  ('transit-apps',             'low',    17, 'Download Japan transit apps'),
  ('travel-insurance',         'low',    18, 'Get travel insurance for all 6 members'),
  ('sim-wifi',                 'low',    19, 'Arrange pocket WiFi / SIM / eSIM'),
  ('power-adaptor',            'low',    20, 'Pack universal adaptor (Type A)'),
  ('halal-apps',               'low',    21, 'Download halal food finder apps'),
  ('yen-cash',                 'low',    22, 'Prepare Japanese yen cash')
on conflict (id) do nothing;

-- 2. auth linkage column on participants
alter table participants add column if not exists auth_user_id uuid unique references auth.users(id);

-- ============================================================================
-- STOP HERE. Now go create the 6 auth users manually:
-- Dashboard → Authentication → Users → "Add user" → "Create new user"
--   Email                 | Password (placeholder — change before sharing with the group!)
--   jasoncwy@trip.local   | ChangeMe2026!
--   ray@trip.local        | ChangeMe2026!
--   sab1@trip.local       | ChangeMe2026!
--   sab2@trip.local       | ChangeMe2026!
--   nadia@trip.local      | ChangeMe2026!
--   kainin@trip.local     | ChangeMe2026!
-- IMPORTANT: check "Auto Confirm User" for each one (no email delivery for @trip.local addresses).
-- Once all 6 exist, continue with Part 2 below.
-- ============================================================================


-- ============================================================================
-- PART 2 — run after the 6 users exist
-- ============================================================================

-- 3. link each participant to their auth user
update participants set auth_user_id = (select id from auth.users where email = 'jasoncwy@trip.local') where name = 'JasonCWY';
update participants set auth_user_id = (select id from auth.users where email = 'ray@trip.local')      where name = 'Ray';
update participants set auth_user_id = (select id from auth.users where email = 'sab1@trip.local')     where name = 'Sab1';
update participants set auth_user_id = (select id from auth.users where email = 'sab2@trip.local')     where name = 'Sab2';
update participants set auth_user_id = (select id from auth.users where email = 'nadia@trip.local')    where name = 'Nadia';
update participants set auth_user_id = (select id from auth.users where email = 'kainin@trip.local')   where name = 'Kai Nin';

-- sanity check — all 6 rows should show a non-null auth_user_id
select name, auth_user_id from participants order by name;

-- 4. drop whatever open/anon policies exist today on the 4 pre-existing tables
--    (names vary depending on how they were originally created, so drop by lookup instead of by guessed name)
do $$
declare pol record;
begin
  for pol in
    select policyname, tablename from pg_policies
    where schemaname = 'public' and tablename in ('participants','categories','expenses','expense_splits')
  loop
    execute format('drop policy if exists %I on public.%I', pol.policyname, pol.tablename);
  end loop;
end $$;

-- 5. recreate as authenticated-only policies
create policy "read participants" on participants for select to authenticated using (true);
create policy "read categories"   on categories   for select to authenticated using (true);

create policy "read expenses"              on expenses for select to authenticated using (true);
create policy "insert expenses"            on expenses for insert to authenticated with check (true);
create policy "update expenses"            on expenses for update to authenticated using (true) with check (true);
create policy "delete non-seeded expenses" on expenses for delete to authenticated using (is_seeded = false);

create policy "read splits"   on expense_splits for select to authenticated using (true);
create policy "insert splits" on expense_splits for insert to authenticated with check (true);
create policy "update splits" on expense_splits for update to authenticated using (true) with check (true);
create policy "delete splits" on expense_splits for delete to authenticated using (true);

alter table checklist_items enable row level security;
create policy "read checklist"   on checklist_items for select to authenticated using (true);
create policy "update checklist" on checklist_items for update to authenticated using (true) with check (true);

-- 6. realtime — push live updates to all connected clients
alter publication supabase_realtime add table expenses, expense_splits, checklist_items;

-- ============================================================================
-- PART 3 — fix: tables created via SQL Editor don't automatically get
-- role-level GRANTs the way Supabase's Table Editor does. RLS policies alone
-- aren't enough — Postgres also checks table-level privileges first.
-- Run this if you see "permission denied for table checklist_items".
-- ============================================================================
grant select, update on checklist_items to authenticated;

-- ============================================================================
-- PART 4 — partial payment tracking on expense splits
-- Adds how much each person has actually paid toward their share, so the
-- expense tracker can show partial progress (paid RM30 of RM60), not just
-- a settled/unsettled boolean. Run in the SQL Editor.
-- ============================================================================
alter table expense_splits add column if not exists paid_amount numeric not null default 0;

-- backfill: rows already marked settled are treated as fully paid
update expense_splits set paid_amount = share_amount where is_settled = true and paid_amount = 0;

-- ============================================================================
-- PART 5 — restrict expense deletion to the payer (the person owed reimbursement)
-- Replaces the "any authenticated user can delete" policies so only the person
-- who paid for an expense can remove it (and its split rows). Run in SQL Editor.
-- ============================================================================
drop policy if exists "delete non-seeded expenses" on expenses;
create policy "payer deletes own non-seeded expenses" on expenses for delete to authenticated
using (
  is_seeded = false
  and paid_by_id = (select id from participants where auth_user_id = auth.uid())
);

drop policy if exists "delete splits" on expense_splits;
create policy "payer deletes own expense splits" on expense_splits for delete to authenticated
using (
  exists (
    select 1 from expenses e
    join participants p on p.id = e.paid_by_id
    where e.id = expense_splits.expense_id
      and e.is_seeded = false
      and p.auth_user_id = auth.uid()
  )
);

-- ============================================================================
-- PART 6 — fold hotel settlements into the expense list
-- The Tokyo/Osaka hotels are seeded expenses; this aligns the seeded split
-- paid-amounts with the real settlement state so the static hotel cards can be
-- retired (the info now lives in the expense list + Settle Up). Already applied.
-- ============================================================================
update expense_splits set paid_amount = 283.58, is_settled = false
  where expense_id = 'a0000000-0000-0000-0000-000000000001'
    and participant_id = 'bc96af5c-ba2f-40df-9566-68e6c3aae8f0'; -- Kai Nin (Tokyo, 50%)
update expense_splits set paid_amount = 300.00, is_settled = false
  where expense_id = 'a0000000-0000-0000-0000-000000000001'
    and participant_id = '5ff1c258-db21-4104-9b85-b669cbc218d8'; -- Sab2 (Tokyo, partial)

-- ============================================================================
-- PART 7 — threaded comments on checklist items
-- A running list of comments (author + time) per checklist item, live-synced.
-- Run in the SQL Editor.
-- ============================================================================
create table if not exists checklist_comments (
  id             uuid primary key default gen_random_uuid(),
  item_id        text not null references checklist_items(id) on delete cascade,
  participant_id uuid references participants(id),
  body           text not null,
  created_at     timestamptz not null default now()
);

alter table checklist_comments enable row level security;
grant select, insert, delete on checklist_comments to authenticated;

create policy "read comments"   on checklist_comments for select to authenticated using (true);
create policy "insert comments" on checklist_comments for insert to authenticated with check (true);
create policy "delete own comments" on checklist_comments for delete to authenticated
  using (participant_id = (select id from participants where auth_user_id = auth.uid()));

alter publication supabase_realtime add table checklist_comments;

-- ============================================================================
-- PART 8 — let group members add / remove checklist items
-- The checklist was read+update only; this allows inserting new to-do items
-- and deleting them (comments cascade via the FK). Run in the SQL Editor.
-- ============================================================================
grant insert, delete on checklist_items to authenticated;

create policy "insert checklist" on checklist_items for insert to authenticated with check (true);
create policy "delete checklist" on checklist_items for delete to authenticated using (true);
