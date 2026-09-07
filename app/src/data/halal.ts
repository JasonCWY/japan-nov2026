export interface HalalHotspot {
  area: string
  lookFor: string
  tips: string
}

export const halalIntro =
  '🕌 3 Muslims in group: Sab1, Sab2, Nadia. Plan meals and activities with halal options.'

export const tokyoHotspots: HalalHotspot[] = [
  { area: 'Asakusa', lookFor: 'Halal ramen, halal kebab shops near Senso-ji', tips: 'Day 1 — good intro area' },
  { area: 'Shinjuku', lookFor: 'Halal hub near east exit; Tokyo Halal Restaurant cluster', tips: 'Day 4 evening dinner' },
  { area: 'Harajuku / Omotesando', lookFor: 'A few halal burger/kebab spots', tips: 'Day 4 lunch area' },
  { area: 'Akihabara', lookFor: 'Some halal options, Muslim-friendly ramen', tips: 'Day 4 if kart is here' },
  { area: 'DisneySea', lookFor: 'Limited halal; seafood/fish dishes available', tips: 'Pack snacks; eat before' },
  { area: 'Kawaguchiko', lookFor: 'Very limited — plan ahead!', tips: 'Bring packed lunch' },
]

export const osakaHotspots: HalalHotspot[] = [
  { area: 'Dotonbori / Namba', lookFor: 'Halal takoyaki stalls, halal okonomiyaki', tips: 'Day 5 — walk and eat' },
  { area: 'Shinsaibashi', lookFor: 'Several halal-certified restaurants', tips: 'Day 5 shopping area' },
  { area: 'USJ', lookFor: 'Limited; fish/seafood options only', tips: 'Pack snacks; eat before/after' },
]

export const generallySafe = [
  'Sushi / sashimi (fish only, no pork) — ask about rice wine vinegar (generally fine)',
  'Seafood dishes — verify no pork broth',
  'Vegetarian / vegan Japanese food',
  'Matcha ice cream, mochi (most are vegetarian)',
  'Fruit shops, convenience store fruits & salads',
]

export const alwaysCheck = [
  'Ramen broth (may contain pork — specifically look for halal-certified ramen)',
  'Yakiniku (BBQ) — many restaurants have pork mixed in; request halal or pork-free',
  'Gyoza — often contains pork',
  'Miso soup with dashi (fish stock is fine, but check for pork)',
  'Okonomiyaki — batter often OK, but toppings may include pork',
]

export const recommendedApps = [
  'HalalNavi Japan — maps halal restaurants',
  'Muslim Pro — prayer times + halal map',
  'Google Maps — search "halal [area name]"',
]

export const prayerFacilities = [
  'Tokyo Camii (Yoyogi Uehara) — largest mosque in Tokyo; near Meiji Shrine area (Day 4)',
  'Osaka Ibaraki Masjid — in Ibaraki, accessible from Osaka',
  'Musalla spaces available at Tokyo DisneySea (ask Guest Services)',
  'USJ — ask staff for prayer room / quiet area',
  'Some airports and train stations have prayer rooms',
  'Haneda Airport T3 has a multi-faith prayer room',
]
