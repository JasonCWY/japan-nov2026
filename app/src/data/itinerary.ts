export type ActivityTagKind = 'theme' | 'nature' | 'culture' | 'food' | 'shopping' | 'transport'

export interface Activity {
  tag?: { kind: ActivityTagKind; label: string }
  text: string // may contain **bold** segments
}

export interface RouteSeg {
  nodes: string[]
  label: string
}

export interface RouteSection {
  heading: string
  badge?: { label: string; tone: 'red' | 'green' }
  segs: RouteSeg[]
  note?: string
}

export interface ReturnItem {
  badge: 'main' | 'alt' | 'note'
  text: string
}

export interface ReturnBox {
  title: string
  items: ReturnItem[]
}

export interface DayEntry {
  day: number
  title: string
  date: string
  location: string
  activities: Activity[]
  halalNote?: string
  weatherNote?: string
  routeSections: RouteSection[]
  returnBox?: ReturnBox
  tip?: string
}

export const itinerary: DayEntry[] = [
  {
    day: 0,
    title: 'Departure from KL',
    date: 'Saturday, 7 November 2026',
    location: 'KL → Manila → Tokyo',
    activities: [
      { text: 'Be at **KLIA 1** by **9:20AM** or earlier for check-in' },
      { text: '**PR526**: KL → Manila (connecting flight)' },
      { text: '**PR424**: Manila → Tokyo Haneda T3 (overnight)' },
      { text: 'Note: Hotel check-in date set as **7 November**' },
    ],
    weatherNote: '⏰ Overnight flight — sleep well before the big trip!',
    routeSections: [
      {
        heading: '✈️ Flight Route',
        segs: [
          {
            nodes: ['KLIA 1', 'Manila NAIA T2', 'Tokyo Haneda T3'],
            label: 'PR526 → PR424 · Overnight · Arrive 8 Nov 00:15AM',
          },
        ],
      },
    ],
  },
  {
    day: 1,
    title: 'Arrive Tokyo — Easy Day',
    date: 'Sunday, 8 November 2026',
    location: '🗼 Tokyo',
    activities: [
      { text: '**00:15AM** — Arrive Haneda Terminal 3' },
      { text: 'Easy recovery day' },
      { tag: { kind: 'culture', label: 'Culture' }, text: '**Asakusa** — Senso-ji Temple, Nakamise shopping street' },
      { tag: { kind: 'nature', label: 'Outdoors' }, text: '**Sumida River** walk' },
      { tag: { kind: 'culture', label: 'Landmark' }, text: '**Tokyo Skytree** (exterior)' },
    ],
    halalNote: '🕌 Halal: Asakusa area has good halal options — look for certified ramen and gyudon shops near Senso-ji.',
    routeSections: [
      {
        heading: '🌙 Airport → Hotel (00:15AM arrival)',
        segs: [
          {
            nodes: ['Haneda T3', 'OKU Apartment'],
            label: '🚕 Taxi/van recommended · ~40 min · ~¥5,000–8,000 total (split 6-way) · trains have stopped',
          },
        ],
      },
      {
        heading: '🌅 Daytime — Hotel → Asakusa',
        segs: [
          { nodes: ['Hotel (near Tokyo Stn)', 'Asakusa Stn'], label: 'Tokyo Metro Ginza Line from Nihombashi · ~10 min · ¥180' },
          {
            nodes: ['Asakusa Stn', 'Tokyo Skytree Stn'],
            label: 'Tobu Skytree Line · 1 stop · 2 min · ¥150 · OR 15 min walk along Sumida River',
          },
        ],
      },
    ],
    returnBox: {
      title: '🏠 Return to Hotel',
      items: [
        { badge: 'main', text: 'Asakusa Stn → (Ginza Line) → Nihombashi → hotel · ~12 min' },
        { badge: 'alt', text: 'Taxi from Asakusa ~¥1,500–2,000 if tired' },
      ],
    },
  },
  {
    day: 2,
    title: 'Tokyo DisneySea 🎡',
    date: 'Monday, 9 November 2026',
    location: '🗼 Tokyo',
    activities: [
      { tag: { kind: 'theme', label: 'Theme Park' }, text: '**Tokyo DisneySea** — go early (rope drop)' },
      { text: 'Stay for night shows and evening entertainment if available' },
      { text: 'Book tickets in advance via Tokyo Disney Resort official site' },
    ],
    halalNote:
      '🕌 Halal: DisneySea has limited halal options. Pack some snacks or eat before entering. Some restaurants may offer seafood/vegetarian options.',
    weatherNote: '🎟️ Action needed: Book tickets ASAP — very popular, sells out weeks ahead!',
    routeSections: [
      {
        heading: '🚃 Hotel → DisneySea',
        segs: [
          { nodes: ['Tokyo Stn', 'Maihama Stn'], label: 'JR Keiyō Line (Rapid) · ~15 min · ¥220 · pay via Suica' },
          {
            nodes: ['Maihama Stn', 'Tokyo DisneySea'],
            label: 'Disney Resort Line (Bayside Stn) · ~12 min · ¥260 · OR walk ~20 min',
          },
        ],
        note: '↪ Aim for first train ~7:00AM — DisneySea opens 8:00AM (rope drop)',
      },
    ],
    returnBox: {
      title: '🏠 Return to Hotel',
      items: [
        { badge: 'main', text: 'DisneySea → (Disney Resort Line) → Maihama → (JR Keiyō) → Tokyo Stn → hotel' },
        { badge: 'note', text: 'Last JR Keiyō from Maihama ~23:30 — safe to stay for night shows' },
      ],
    },
  },
  {
    day: 3,
    title: 'Mt Fuji Bike Ride 🚴',
    date: 'Tuesday, 10 November 2026',
    location: '🗻 Kawaguchiko',
    activities: [
      { tag: { kind: 'nature', label: 'Day Trip' }, text: '**Mt Fuji / Kawaguchiko** (Fuji Five Lakes)' },
      { text: 'Aim for 7–8AM departure for maximum daylight' },
      { text: 'Rent bicycles near Kawaguchiko Station' },
      { text: 'Cycle around **Lake Kawaguchi**, **Oishi Park**' },
      { text: 'Short hike to **Chureito Pagoda** for iconic Fuji views + photos' },
      { text: 'Return to Tokyo in the evening' },
    ],
    weatherNote: '☁️ Weather note: Fuji visibility depends on weather. Swap with Day 4 if cloudy.',
    halalNote: '🕌 Halal: Limited options around Kawaguchiko. Pack lunch or eat before departing Tokyo.',
    routeSections: [
      {
        heading: '🚃 Option A — Fuji Excursion Train (Recommended)',
        segs: [
          {
            nodes: ['Shinjuku Stn', 'Otsuki Stn'],
            label: 'JR Chuo Line "Fuji Excursion" Limited Express · ~1hr 20min · JR Pass valid · reserve seat',
          },
          { nodes: ['Otsuki Stn', 'Kawaguchiko Stn'], label: 'Fujikyu Railway · ~50 min · ¥1,170/person · NOT covered by JR Pass' },
        ],
        note: '↪ Total ~2hrs 10min. Depart Shinjuku by 7:00–8:00AM for best Fuji visibility',
      },
      {
        heading: '🚌 Option B — Highway Bus (Simpler, Cheaper)',
        segs: [
          {
            nodes: ['Busta Shinjuku', 'Kawaguchiko Stn'],
            label: 'Keio / Fujikyu Express Bus · ~2 hrs direct · ~¥1,750/person · book online in advance · depart 7–8AM',
          },
        ],
        note: '↪ Busta Shinjuku is directly above Shinjuku Station south exit (4F). Book at japanbusonline.com or Klook.',
      },
    ],
    returnBox: {
      title: '🏠 Return to Hotel (Tokyo)',
      items: [
        { badge: 'main', text: 'Train: Kawaguchiko → Otsuki (Fujikyu) → Shinjuku (JR Chuo Express · JR Pass valid) → hotel' },
        { badge: 'alt', text: 'Bus: Kawaguchiko → Busta Shinjuku (Highway Bus ~2hrs) → hotel · ~¥1,750/person' },
        { badge: 'note', text: 'Last bus/train ~19:00–20:00 from Kawaguchiko — leave by 17:30 to be safe' },
      ],
    },
  },
  {
    day: 4,
    title: 'Shibuya / Harajuku / Shinjuku 🛍️',
    date: 'Wednesday, 11 November 2026',
    location: '🗼 Tokyo',
    activities: [
      { tag: { kind: 'culture', label: 'Morning' }, text: '**Meiji Shrine** (peaceful forest temple)' },
      { tag: { kind: 'shopping', label: 'Shopping' }, text: '**Harajuku** — Takeshita Street, Omotesando' },
      { tag: { kind: 'shopping', label: 'Shopping' }, text: '**Shibuya** — Scramble Crossing, 109, shopping' },
      { tag: { kind: 'theme', label: 'Activity' }, text: '**Street Go-Kart (Mario Kart)** at Shibuya or Akihabara OR more shopping' },
      { tag: { kind: 'culture', label: 'Evening' }, text: '**Shinjuku** — Kabukicho, Omoide Yokocho (Memory Lane), dinner' },
    ],
    halalNote: '🕌 Halal: Shinjuku has a halal food hub near Shinjuku Station. Several certified restaurants in the area.',
    routeSections: [
      {
        heading: '🗺️ Getting Around',
        segs: [
          { nodes: ['Tokyo Stn', 'Harajuku Stn'], label: 'JR Yamanote Line · ~25 min · ¥200 · Suica · Meiji Shrine 5-min walk' },
          { nodes: ['Harajuku Stn', 'Shibuya Stn'], label: 'Walk ~12 min along Omotesando · OR JR Yamanote 1 stop · ¥150' },
          {
            nodes: ['Shibuya / Akihabara', 'Shinjuku Stn'],
            label: 'JR Yamanote Line · ~24–30 min · ¥200 · Kabukicho & Omoide Yokocho within 5-min walk',
          },
        ],
      },
    ],
    returnBox: {
      title: '🏠 Return to Hotel',
      items: [
        { badge: 'main', text: 'Shinjuku Stn → (JR Chuo/Sobu Line) → Tokyo Stn → hotel · ~20 min' },
        { badge: 'alt', text: 'Taxi from Shinjuku ~¥2,000–3,000 (if after last train)' },
      ],
    },
  },
  {
    day: 5,
    title: 'Travel to Osaka 🚄',
    date: 'Thursday, 12 November 2026',
    location: '🗼→🏙️ Tokyo → Osaka',
    activities: [
      {
        tag: { kind: 'transport', label: 'Transport' },
        text: '**Shinkansen** Shinagawa → Shin-Osaka · ~2.5 hrs · Hikari/Kodama · ~¥14,720/pax',
      },
      { text: 'Check in to Osaka accommodation' },
      { tag: { kind: 'food', label: 'Food' }, text: '**Dotonbori** — street food, takoyaki, okonomiyaki' },
      { tag: { kind: 'shopping', label: 'Shopping' }, text: '**Shinsaibashi** shopping arcade' },
      { text: '🌟 **Glico Man photo** — best after sunset when lights are on' },
    ],
    halalNote: '🕌 Halal: Dotonbori has certified halal takoyaki stalls and several Muslim-friendly restaurants near Namba.',
    routeSections: [
      {
        heading: '🚄 Hotel → Osaka via Shinkansen',
        badge: { label: '❌ Not Yet Booked', tone: 'red' },
        segs: [
          { nodes: ['OKU Hotel', 'Shinagawa Stn'], label: 'JR Yamanote Line · 1 stop from Tokyo Stn · ~3 min · less crowded platform than Tokyo Stn' },
          {
            nodes: ['Shinagawa Stn', 'Shin-Osaka Stn'],
            label: 'Shinkansen Hikari/Kodama · ~2.5 hrs · ~¥14,720/person · reserve seat · aim 8–9AM departure',
          },
          { nodes: ['Shin-Osaka Stn', 'Namba Stn'], label: 'Osaka Metro Midosuji Line · ~15 min · ¥290 · use Suica IC card' },
        ],
        note: '↪ Dotonbori & Shinsaibashi are within 5-min walk of Namba Station',
      },
    ],
  },
  {
    day: 6,
    title: 'Universal Studios Japan 🎢',
    date: 'Friday, 13 November 2026',
    location: '🏙️ Osaka',
    activities: [
      { tag: { kind: 'theme', label: 'Theme Park' }, text: '**USJ — Full Day**' },
      { text: 'Arrive early (rope drop) for Harry Potter World, Super Nintendo World etc.' },
      { text: 'Consider Express Passes for popular rides' },
    ],
    halalNote:
      '🕌 Halal: USJ has limited halal options. Plan meals ahead — some fish/seafood options available. Consider packing snacks.',
    weatherNote: '🎟️ Action needed: Book USJ tickets in advance. Express Passes sell out fast!',
    routeSections: [
      {
        heading: '🚃 Hotel (Namba) → USJ',
        segs: [
          { nodes: ['JR Namba Stn', 'Nishikujo Stn'], label: 'JR Osaka Loop Line · ~10 min · ¥200 · Suica' },
          { nodes: ['Nishikujo Stn', 'Universal City Stn'], label: 'JR Yumesaki Line · ~5 min · ¥200 · Suica · USJ gate is 3-min walk' },
        ],
        note: '↪ Total ~20 min from hotel. Take first available train — arrive before park opens.',
      },
    ],
    returnBox: {
      title: '🏠 Return to Osaka Hotel',
      items: [
        { badge: 'main', text: 'Universal City → Nishikujo (JR Yumesaki) → JR Namba (JR Loop Line) → walk to hotel' },
        { badge: 'note', text: 'USJ closes ~21:00 · last JR Yumesaki from Universal City ~23:30 · safe to stay for closing' },
      ],
    },
  },
  {
    day: 7,
    title: 'Last Day — Osaka → Tokyo → Depart 👋',
    date: 'Saturday, 14 November 2026',
    location: '🏙️→🗼→✈️',
    activities: [
      { tag: { kind: 'transport', label: 'Morning' }, text: '**Shinkansen** Shin-Osaka → Shinagawa — return to Tokyo (~2.5 hrs)' },
      {
        text:
          'Store luggage at coin lockers at **Shinagawa Station** (on the way to Haneda — convenient!). Backup: Tokyo Station if Shinagawa lockers full.',
      },
      { tag: { kind: 'shopping', label: 'Shopping' }, text: '**Ginza** or **Shibuya** — last-minute souvenirs & shopping' },
      { text: '⏰ Arrive at **Haneda T3 by 10PM** for final check-in' },
      { text: '**PR423** departs ~01:15AM (15 Nov)' },
    ],
    weatherNote: '⚠️ Leave Ginza/Shibuya by 19:00 at the latest. Allow buffer for luggage, security, and immigration.',
    routeSections: [
      {
        heading: '🚄 Osaka → Tokyo via Shinkansen',
        badge: { label: '❌ Not Yet Booked', tone: 'red' },
        segs: [
          { nodes: ['Namba Stn', 'Shin-Osaka Stn'], label: 'Osaka Metro Midosuji Line · ~15 min · ¥290 · use Suica IC card' },
          { nodes: ['Shin-Osaka Stn', 'Shinagawa Stn'], label: 'Shinkansen Hikari/Kodama · ~2.5 hrs · ~¥14,720/person · depart 8–9AM' },
        ],
        note: '↪ Shinagawa is perfectly placed — store luggage here, go shopping, then take Keikyu directly to Haneda T3!',
      },
      {
        heading: '🛍️ Tokyo Last Stop — Luggage at Shinagawa',
        segs: [
          {
            nodes: ['Shinagawa Stn', 'Coin Lockers'],
            label: '✅ Primary: Shinagawa Station lockers · ¥500–900/locker · book in advance if possible. Backup: Tokyo Stn if full.',
          },
          { nodes: ['Tokyo Stn', 'Ginza / Shibuya'], label: 'Ginza: 5-min walk · Shibuya: JR Yamanote ~25 min · ¥200' },
        ],
      },
      {
        heading: '✈️ → Haneda T3 (be there by 10PM)',
        segs: [
          { nodes: ['Shinagawa Stn', 'Haneda T3'], label: 'Keikyu Airport Line (Ltd Exp) · ~25 min · ¥410 · trains run until ~23:40' },
          { nodes: ['Hamamatsucho Stn', 'Haneda T3'], label: 'Tokyo Monorail · ~20 min · ¥500 · alternative if at central Tokyo' },
        ],
      },
    ],
    returnBox: {
      title: '⏰ Departure Timeline',
      items: [
        { badge: 'main', text: 'Leave Ginza/Shibuya by 19:00 → Haneda by ~20:00 → check-in & immigration by 22:00' },
        { badge: 'note', text: 'PR423 departs ~01:15AM (15 Nov) · be at gate by 23:30' },
      ],
    },
  },
]
