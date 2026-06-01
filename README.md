# japan-nov2026

Group travel itinerary and expense settlement for Tokyo & Osaka, Nov 2026.

## Project Structure

```
japan-nov2026/
├── Source/                             # Data sources — import this folder into AI
│   ├── Nov Japan Itinerary v1.0.html   # Original itinerary document
│   └── trip_knowledge_base.md          # Trip research and reference notes
├── index.html                          # Main dashboard / group trip tool (output)
├── config.js                           # Supabase credentials — gitignored, NOT in repo (see below)
├── CLAUDE.md                           # AI coding instructions for this repo
└── README.md                           # This file
```

## How to Use

1. **Import the `Source` folder into your AI assistant** — it contains the raw itinerary and knowledge base used to generate and update the trip dashboard.
2. **Open `index.html`** in a browser — this is the main output: an interactive dashboard and tool for the Japan group trip.

## Files

| File | Description |
|------|-------------|
| `Source/Nov Japan Itinerary v1.0.html` | Original itinerary (v1.0) used as the primary data source |
| `Source/trip_knowledge_base.md` | Curated trip notes, tips, and reference information |
| `index.html` | Interactive group trip dashboard (the main output) |
| `CLAUDE.md` | Coding guidelines for AI assistants working on this repo |

## Expense Tracker

The **Group Expense Tracker** is backed by **Supabase** (cloud database). All 6 group members see the same live data — adding or deleting an expense on one device is reflected for everyone.

### config.js — Credentials committed, safe by design

`config.js` holds the Supabase project URL and anon key. It is committed to the repo — this is intentional and safe because:

- The anon key is a **publishable key** (`sb_publishable_`) designed to be client-facing
- All tables are protected by **Row Level Security (RLS)** — the key alone grants no more access than the policies allow
- RLS policies permit group members to read and write expenses, but cannot access internal Supabase infrastructure or other projects

If you clone this repo, `config.js` is already included — no manual setup needed.

## Development Notes

- All CSS and UI must be **responsive** — compatible with phone, tablet, and desktop viewports.
- Use existing CSS classes from the stylesheet; avoid hardcoded pixel sizes in inline styles.
- `CLAUDE.md` at the repo root carries these instructions so they apply automatically when using Claude Code on any device.
