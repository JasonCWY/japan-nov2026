# japan-nov2026

Group travel itinerary and expense settlement for Tokyo & Osaka, Nov 2026.

## Project Structure

```
japan-nov2026/
├── Source/                             # Data sources — import this folder into AI
│   ├── Nov Japan Itinerary v1.0.html   # Original itinerary document
│   └── trip_knowledge_base.md          # Trip research and reference notes
├── index.html                          # Main dashboard / group trip tool (output)
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

The **Group Expense Tracker** inside `index.html` stores data in your browser's `localStorage`. This means:

- Data is saved **per device/browser** — it is not synced across devices or people.
- Each group member sees their own local copy of expenses.
- Clearing browser data will erase recorded expenses.

## Development Notes

- All CSS and UI must be **responsive** — compatible with phone, tablet, and desktop viewports.
- Use existing CSS classes from the stylesheet; avoid hardcoded pixel sizes in inline styles.
- `CLAUDE.md` at the repo root carries these instructions so they apply automatically when using Claude Code on any device.
