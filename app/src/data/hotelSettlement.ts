export interface SettlementMember {
  name: string
  initials: string
  color: string
  badge: string
  paid: number
  percent: number
  outstanding: number
  status: 'full' | 'partial' | 'unpaid'
  isPayer?: boolean
}

export interface HotelSettlement {
  title: string
  payer: string
  perPerson: number
  collected: number
  owed: number
  members: SettlementMember[]
}

export const tokyoHotelSettlement: HotelSettlement = {
  title: '🏨 Tokyo Hotel Settlement — OKU Apartment',
  payer: 'Sab1',
  perPerson: 567.16,
  collected: 2285.06,
  owed: 550.74,
  members: [
    { name: 'JasonCWY', initials: 'J', color: '#3498db', badge: '', paid: 567.16, percent: 100, outstanding: 0, status: 'full' },
    { name: 'Kai Nin', initials: 'K', color: '#26a69a', badge: '1st payment made', paid: 283.58, percent: 50, outstanding: 283.58, status: 'partial' },
    { name: 'Nadia', initials: 'N', color: '#ff7043', badge: 'Fully paid', paid: 567.16, percent: 100, outstanding: 0, status: 'full' },
    { name: 'Sab2', initials: 'S2', color: '#e91e63', badge: 'Partial payment', paid: 300.0, percent: 53, outstanding: 267.16, status: 'partial' },
    { name: 'Ray', initials: 'R', color: '#9b59b6', badge: 'Fully paid', paid: 567.16, percent: 100, outstanding: 0, status: 'full' },
    { name: 'Sab1', initials: 'S1', color: '#e91e63', badge: '💳 Hotel Payer', paid: 567.16, percent: 100, outstanding: 0, status: 'full', isPayer: true },
  ],
}

export const osakaHotelSettlement: HotelSettlement = {
  title: '🏨 Osaka Hotel Settlement',
  payer: 'Sab1',
  perPerson: 186.13,
  collected: 744.52,
  owed: 186.13,
  members: [
    { name: 'JasonCWY', initials: 'J', color: '#3498db', badge: 'Fully paid', paid: 186.13, percent: 100, outstanding: 0, status: 'full' },
    { name: 'Kai Nin', initials: 'K', color: '#26a69a', badge: 'Fully paid', paid: 186.13, percent: 100, outstanding: 0, status: 'full' },
    { name: 'Nadia', initials: 'N', color: '#ff7043', badge: 'Fully paid', paid: 186.13, percent: 100, outstanding: 0, status: 'full' },
    { name: 'Sab2', initials: 'S2', color: '#e91e63', badge: 'Not yet paid', paid: 0, percent: 0, outstanding: 186.13, status: 'unpaid' },
    { name: 'Ray', initials: 'R', color: '#9b59b6', badge: 'Fully paid', paid: 186.13, percent: 100, outstanding: 0, status: 'full' },
    { name: 'Sab1', initials: 'S1', color: '#e91e63', badge: '💳 Hotel Payer', paid: 186.13, percent: 100, outstanding: 0, status: 'full', isPayer: true },
  ],
}
