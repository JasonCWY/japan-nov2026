import type { Currency, Expense, Participant } from '../types/domain'

export interface Balance {
  RM: number
  JPY: number
}

export interface Transfer {
  fromId: string
  fromName: string
  toId: string
  toName: string
  currency: Currency
  amount: number
}

const EPS = 0.01

/**
 * Net balance per participant, per currency.
 *  positive = they are owed money (a creditor — fronted more than they owe)
 *  negative = they owe money (a debtor)
 * Derived from unpaid split shares: each unpaid share is a debt from that person to the expense's payer.
 */
export function computeBalances(expenses: Expense[], participants: Participant[]): Map<string, Balance> {
  const bal = new Map<string, Balance>(participants.map((p) => [p.id, { RM: 0, JPY: 0 }]))

  for (const exp of expenses) {
    const payer = participants.find((p) => p.name === exp.paidBy)
    if (!payer) continue
    for (const s of exp.splits) {
      if (s.participantId === payer.id) continue
      const remaining = s.shareAmount - s.paidAmount
      if (remaining <= EPS) continue
      const debtor = bal.get(s.participantId)
      const creditor = bal.get(payer.id)
      if (debtor) debtor[exp.currency] -= remaining
      if (creditor) creditor[exp.currency] += remaining
    }
  }
  return bal
}

/** Greedy "who pays whom" plan that clears all balances in the fewest transfers, per currency. */
export function settleUp(expenses: Expense[], participants: Participant[], currency: Currency): Transfer[] {
  const bal = computeBalances(expenses, participants)

  const creditors: { id: string; name: string; amt: number }[] = []
  const debtors: { id: string; name: string; amt: number }[] = []
  for (const p of participants) {
    const amt = bal.get(p.id)?.[currency] ?? 0
    if (amt > EPS) creditors.push({ id: p.id, name: p.name, amt })
    else if (amt < -EPS) debtors.push({ id: p.id, name: p.name, amt: -amt })
  }
  creditors.sort((a, b) => b.amt - a.amt)
  debtors.sort((a, b) => b.amt - a.amt)

  const transfers: Transfer[] = []
  let i = 0
  let j = 0
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].amt, creditors[j].amt)
    transfers.push({
      fromId: debtors[i].id,
      fromName: debtors[i].name,
      toId: creditors[j].id,
      toName: creditors[j].name,
      currency,
      amount: pay,
    })
    debtors[i].amt -= pay
    creditors[j].amt -= pay
    if (debtors[i].amt < EPS) i++
    if (creditors[j].amt < EPS) j++
  }
  return transfers
}
