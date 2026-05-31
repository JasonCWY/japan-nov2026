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

## Final Objective
Integrate Supabase as the database backend for the **Japan Trip Expense Tracker** — replacing any local/static data with live reads/writes from the cloud DB.

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
1. Connect `index.html` frontend to Supabase (replace localStorage with live DB reads/writes)
2. Indexes and query optimization
3. `EXPLAIN ANALYZE` for performance profiling
4. Window functions

## Planned Features

### Expense Split Calculator
When a user adds a new expense:
1. User enters: description, amount, currency, paid-by, category, notes
2. App auto-calculates each person's share (amount ÷ 6, split equally)
3. Inserts one row into `expenses`
4. Inserts 6 rows into `expense_splits` (one per participant, `is_settled = false` for all except the payer)
5. UI shows live debt summary — who owes who and how much — queried directly from Supabase

Future refinement: support unequal splits (e.g. some members opt out of an activity).

## Supabase Integration Notes
- Use `@supabase/supabase-js` client in the frontend
- Store `SUPABASE_URL` and `SUPABASE_ANON_KEY` as environment variables (never hardcode in source)
- Expense tracker target tables: likely `expenses`, `categories`, `participants`
