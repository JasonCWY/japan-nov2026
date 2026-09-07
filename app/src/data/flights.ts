export interface FlightCard {
  label: string
  status: string
  route: { code: string; name: string }[]
  meta: { label: string; value: string }[]
}

export const flightsIntro = '✅ All flights booked and fully paid & settled.'

export const flights: FlightCard[] = [
  {
    label: 'Outbound',
    status: '✓ Confirmed',
    route: [
      { code: 'KUL', name: 'Kuala Lumpur' },
      { code: 'MNL', name: 'Manila' },
      { code: 'HND', name: 'Tokyo Haneda T3' },
    ],
    meta: [
      { label: 'Depart KL', value: 'Sat 7 Nov 2026' },
      { label: 'Flights', value: 'PR526 → PR424' },
      { label: 'Arrive Tokyo', value: 'Sun 8 Nov 00:15AM' },
      { label: 'KLIA 1 Check-in by', value: '9:20AM (7 Nov)' },
    ],
  },
  {
    label: 'Return',
    status: '✓ Confirmed',
    route: [
      { code: 'HND', name: 'Tokyo Haneda T3' },
      { code: 'MNL', name: 'Manila' },
      { code: 'KUL', name: 'Kuala Lumpur' },
    ],
    meta: [
      { label: 'Depart Tokyo', value: 'Sun 15 Nov ~01:15AM' },
      { label: 'Flights', value: 'PR423 → PR525' },
      { label: 'At Haneda T3 by', value: '10PM (14 Nov)' },
    ],
  },
]
