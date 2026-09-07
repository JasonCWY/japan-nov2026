# japan-nov2026

Group travel itinerary and expense settlement for Tokyo & Osaka, Nov 2026.

**Live app:** https://japan-nov2026.vercel.app/

## Project Structure

```
japan-nov2026/
├── Source/                             # Data sources — import this folder into AI
│   ├── Nov Japan Itinerary v1.0.html   # Original itinerary document
│   └── trip_knowledge_base.md          # Trip research and reference notes
├── app/                                 # React + Vite + TypeScript app (the live dashboard)
│   ├── src/data/                        # Static content: itinerary, halal guide, members, flights
│   ├── src/hooks/                       # Supabase data hooks (expenses, checklist, auth) w/ Realtime
│   ├── src/components/                  # UI, grouped by tab
│   └── .env.example                     # Supabase env var template
├── supabase/migration_v2.sql           # Schema/RLS/auth migration (source of truth for DB shape)
├── CLAUDE.md                           # AI coding instructions for this repo
├── POSTGRES_LEARNING.md                # Supabase/Postgres learning notes and history
└── README.md                           # This file
```

## Stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS, in `app/`
- **Backend:** Supabase (Postgres + Auth + Realtime), free tier
- **Hosting:** Vercel (free Hobby tier), auto-deployed from `main`, Root Directory `app`

## How to Use

1. **Live app:** just open the Vercel URL above, pick your name, and enter the group PIN.
2. **Local dev:**
   ```
   cd app
   npm install
   cp .env.example .env.local   # fill in VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
   npm run dev
   ```
3. **Import the `Source` folder into your AI assistant** if you need the original raw itinerary/knowledge base for context.

## Auth

Each of the 6 trip members has a Supabase Auth account under a synthesized `name@trip.local` email, all sharing one group PIN as the password. The login screen only ever shows a name picker + PIN field — nobody needs a real email or a Supabase account of their own. See `supabase/migration_v2.sql` for how the accounts are provisioned.

**If you're rotating the PIN:** update each of the 6 accounts' password in Supabase Dashboard → Authentication → Users.

## Expense Tracker & Checklist

Both are backed by Supabase and synced live via Supabase Realtime — changes made by one person appear for everyone else without a refresh. Categories, participants, and category display strings live in the `participants`/`categories` tables; expense splits recompute automatically based on the current participant count, including when an expense is edited.

Itinerary, Halal Guide, and member/flight info are static content in `app/src/data/` — edit the code and push to update them, no database involved.

## Development Notes

- All CSS and UI must be **responsive** — compatible with phone, tablet, and desktop viewports.
- `CLAUDE.md` at the repo root carries AI coding conventions for this repo.
