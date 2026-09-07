export const stats = [
  { value: '8', label: 'Days in Japan' },
  { value: '6', label: 'Travellers' },
  { value: '2', label: 'Cities' },
]

export const shinkansenNote = {
  title: '🚄 Shinkansen (Tokyo ↔ Osaka)',
  badge: '❌ Not Yet Booked',
  lines: [
    'Day 5 (12 Nov): Shinagawa → Shin-Osaka · ~2.5 hrs · Hikari/Kodama',
    'Day 7 (14 Nov): Shin-Osaka → Shinagawa · then shopping → Haneda T3',
    'Est. cost: ~¥30,625/pax  |  vs flights ~¥25,920 (diff ~RM 117/pax)',
    'Why: No airport transfers, fits Day 7 last-day shopping plan perfectly',
  ],
  confirmation: '✅ Decision confirmed · JR Pass NOT worth it (only needed for 3+ cities)',
}

export const suicaNote = {
  title: '💳 Suica IC Cards (No JR Pass)',
  lines: [
    'Tokyo: Suica — buy at Haneda on arrival. Works on all subway, JR & buses. Link to Apple/Google Pay.',
    'Osaka: Your Tokyo Suica works nationwide — no need a new card.',
    'Kawaguchiko: Highway bus (Busta Shinjuku → Kawaguchiko ~¥1,750/pax one-way)',
  ],
  warning: '⚠️ 8 Nov arrival at 00:15AM — trains stopped. Take taxi split 6-way (~¥5,000–8,000 total).',
}

export const accommodationSummary = [
  {
    title: '🗼 Tokyo — OKU Apartment',
    dates: '7 Nov – 12 Nov · 5 nights',
    pills: [
      { tone: 'green' as const, label: '✅ Booked & Paid' },
      { tone: 'orange' as const, label: '⚠️ Settlement Pending' },
    ],
    perPerson: 'RM 567.16 / person',
  },
  {
    title: '🏙️ Osaka — TBC',
    dates: '12 Nov – 14 Nov · 2 nights',
    pills: [{ tone: 'red' as const, label: '❌ Not Yet Booked' }],
    perPerson: '~RM 184.29 / person (NTH Namba)',
  },
]
