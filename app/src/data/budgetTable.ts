export interface BudgetRow {
  item: string
  perPerson: string
  status?: { tone: 'green' | 'orange' | 'red'; label: string }
  statusText?: string
  emphasize?: boolean
}

export const budgetRows: BudgetRow[] = [
  { item: '✈️ Intl Flights (PR)', perPerson: 'TBC (paid)', status: { tone: 'green', label: '✅ Settled' } },
  { item: '🚄 Shinkansen (12 Nov, Shinagawa→Shin-Osaka)', perPerson: '~¥14,720', status: { tone: 'red', label: '❌ Not Bought' } },
  { item: '🚄 Shinkansen (14 Nov, Shin-Osaka→Shinagawa)', perPerson: '~¥14,720', status: { tone: 'red', label: '❌ Not Bought' } },
  { item: '🧳 Shinagawa locker (Day 7)', perPerson: '~¥500–900', statusText: 'Estimate' },
  { item: '🏨 Tokyo Hotel', perPerson: 'RM 567.16', status: { tone: 'orange', label: '⚠️ Settling' } },
  { item: '🏨 Osaka Hotel', perPerson: '~RM 184.29', status: { tone: 'red', label: '❌ Pending' } },
  { item: '🎡 DisneySea Ticket', perPerson: '~¥8,000–10,000', status: { tone: 'red', label: '❌ Not Bought' } },
  { item: '🎢 USJ Ticket', perPerson: '~¥8,500–10,000', status: { tone: 'red', label: '❌ Not Bought' } },
  { item: '🚌 Kawaguchiko Bus (D3)', perPerson: '~¥3,500 (return)', statusText: 'Estimate' },
  { item: '✈️ KIX Transfer (D5/D7)', perPerson: '~¥3,500–5,200', statusText: 'Estimate' },
  { item: '🍜 Food & Daily', perPerson: '~¥40,000–60,000', statusText: 'Estimate' },
  { item: '🛍️ Shopping', perPerson: 'Personal', statusText: '—' },
  { item: 'Estimated Total (excl. shopping)', perPerson: '~¥80,000–100,000 + RM 750+', statusText: 'per person', emphasize: true },
]
