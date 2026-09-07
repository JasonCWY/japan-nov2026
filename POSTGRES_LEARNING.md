# PostgreSQL Learning Project

## Context
- Learning PostgreSQL on Windows (native install, port 5432)
- Local db: `learning` / schema: `shop`
- Tables: `customers`, `products`, `orders`, `order_items` (e-commerce dataset)
- Target: Supabase free tier for shared cloud hosting
- MCP: DBHub planned for Claude Code integration

## Connection Strings
- Local: `postgresql://postgres@localhost:5432/learning`
- Supabase direct (IPv6 only — requires paid add-on, avoid on free tier): `postgresql://postgres:[password]@db.xxxxx.supabase.co:5432/postgres`
- Supabase **Session Pooler** (IPv4, free tier): `postgresql://postgres.[ref]:[password]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`

### Connection Notes
- Always use **Session Pooler** on free tier — direct connection resolves to IPv6 which times out on most networks without the paid IPv4 add-on
- If password contains special characters (e.g. `&`), URL-encode them: `&` → `%26`
- Free tier projects pause after ~1 week of inactivity — restore via dashboard before connecting
- **Tables must be exposed in the Data API** — `Integrations → Data API → Exposed tables` — tables not listed there return `permission denied` even with RLS disabled. This affects the JS client (PostgREST), not direct psql connections.

## Final Objective
Integrate Supabase as the database backend for the **Japan Trip Expense Tracker** — replacing any local/static data with live reads/writes from the cloud DB.

**Status: done.** The app was rewritten as a React/Vite/TypeScript app (`app/`), deployed free on Vercel, with Supabase Auth (name + shared PIN login) and Realtime sync on `expenses`, `expense_splits`, and `checklist_items`. See `supabase/migration_v2.sql` for the schema/RLS/auth migration and the root `README.md`/`CLAUDE.md` for the current architecture. The sections below are kept for historical context; anything marked "(future)" that's now shipped is noted inline.

## Progress
### Covered
- PostgreSQL architecture and connection flow
- PGDATA structure
- Schema creation (`shop`)
- Data seeding (customers, products, orders, order_items)
- Created Supabase project (free tier)
- Resolved Windows IPv6 timeout — must use **Session Pooler** connection, not direct connection
- Designed and created expense tracker schema in Supabase:
  - `participants` — 6 group members with avatar metadata
  - `categories` — 7 expense categories
  - `expenses` — shared group expenses with paid-by reference
  - `expense_splits` — per-person share and settlement tracking
- Seeded Tokyo Hotel and Osaka Hotel expenses with split data

### Next Steps
1. ~~Connect `index.html` frontend to Supabase~~ — done, then superseded entirely by the `app/` React rewrite
2. Indexes and query optimization
3. `EXPLAIN ANALYZE` for performance profiling
4. Window functions

## Planned Features

### Realtime Sync — done
- Implemented via Supabase Realtime channels in `app/src/hooks/useExpenses.ts` and `useChecklist.ts`, subscribed on `expenses`, `expense_splits`, and `checklist_items`
- Replaced the old "refresh to see others' changes" limitation

### Auth & Per-User Ownership — done, with one change from the original plan
- Implemented as **name + shared PIN**, not magic-link email: each participant has a synthesized `name@trip.local` Supabase Auth account, all sharing one group PIN as the password (see `supabase/migration_v2.sql`). Magic-link was dropped in favor of this since it's frictionless for a fixed 6-person group and avoids email delivery setup.
- `participants.auth_user_id` links each participant row to their `auth.users` row (done, instead of adding `user_id` directly to `expenses`)
- RLS: SELECT = all authenticated, INSERT = all authenticated, UPDATE/DELETE = any authenticated participant (not yet restricted to own rows — the `auth_user_id` link makes a future "own rows only" tightening a policy-only change, not a schema change)
- Login UI lives in `app/src/components/auth/LoginScreen.tsx`

### Expense Split Calculator — done
When a user adds a new expense (`app/src/hooks/useExpenses.ts`):
1. User enters: description, amount, currency, paid-by, category, notes
2. App auto-calculates each person's share (amount ÷ **live participant count**, not a hardcoded 6 — fixed during the rewrite so the app tolerates the group size changing)
3. Inserts one row into `expenses`
4. Inserts one `expense_splits` row per participant, `is_settled = false` for all except the payer
5. Editing an expense's amount also recomputes its `expense_splits.share_amount` rows (fixed during the rewrite — previously amounts and splits could drift)

Future refinement: support unequal splits (e.g. some members opt out of an activity) — not implemented.

## Supabase Integration Notes
- `@supabase/supabase-js` client lives in `app/src/lib/supabaseClient.ts`
- `SUPABASE_URL` / `SUPABASE_ANON_KEY` are Vite env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`), set in `app/.env.local` for local dev and in the Vercel dashboard for production — never hardcoded in source
- Live tables: `participants`, `categories`, `expenses`, `expense_splits`, `checklist_items` (see `supabase/migration_v2.sql`)
