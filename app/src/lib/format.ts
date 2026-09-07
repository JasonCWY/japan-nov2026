import type { Currency } from '../types/domain'

export function fmtAmt(currency: Currency, amount: number): string {
  if (currency === 'JPY') return `¥${Math.round(amount).toLocaleString()}`
  return `RM ${amount.toFixed(2)}`
}

export function fmtPer(currency: Currency, amount: number, count: number): string {
  if (count === 0) return fmtAmt(currency, 0)
  return fmtAmt(currency, amount / count)
}
