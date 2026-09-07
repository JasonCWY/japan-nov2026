export type TabId = 'overview' | 'itinerary' | 'expenses' | 'checklist' | 'halal'

export interface Participant {
  id: string
  name: string
  authUserId: string | null
}

export interface Category {
  id: number
  icon: string
  name: string
}

export type Currency = 'RM' | 'JPY'

export interface SplitShare {
  participantId: string
  participantName: string
  shareAmount: number
  paidAmount: number
  isSettled: boolean
}

export interface Expense {
  id: string
  desc: string
  amount: number
  currency: Currency
  paidBy: string
  cat: string
  notes: string
  seeded: boolean
  splits: SplitShare[]
}

export interface ExpenseSplit {
  expenseId: string
  participantId: string
  shareAmount: number
  isSettled: boolean
}

export type ChecklistPriority = 'high' | 'medium' | 'low'

export interface ChecklistItem {
  id: string
  priority: ChecklistPriority
  sortOrder: number
  label: string
  isDone: boolean
  doneBy: string | null
  updatedAt: string
}

export interface ChecklistComment {
  id: string
  itemId: string
  participantId: string | null
  authorName: string
  body: string
  createdAt: string
}
