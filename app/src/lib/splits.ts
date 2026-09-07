import type { Currency, Participant, SplitShare } from '../types/domain'

export type SplitMode = 'equal' | 'custom'

export interface SplitValue {
  mode: SplitMode
  involved: string[] // participant ids
  amounts: Record<string, string> // participantId -> raw input string (custom mode)
}

/** Everyone involved, equal split — the default for a new expense. */
export function initialSplit(participants: Participant[]): SplitValue {
  return {
    mode: 'equal',
    involved: participants.map((p) => p.id),
    amounts: {},
  }
}

/** Rebuild a SplitValue from an existing expense's stored splits (for editing). */
export function splitFromShares(shares: SplitShare[], currency: Currency): SplitValue {
  const involved = shares.map((s) => s.participantId)
  const amounts: Record<string, string> = {}
  shares.forEach((s) => {
    amounts[s.participantId] = shareString(s.shareAmount, currency)
  })
  // treat as "equal" only if every share is (near) identical
  const allEqual =
    shares.length > 0 &&
    shares.every((s) => Math.abs(s.shareAmount - shares[0].shareAmount) < 0.01)
  return { mode: allEqual ? 'equal' : 'custom', involved, amounts }
}

/** Format an amount the way the custom inputs expect (¥ whole, RM 2dp). */
export function shareString(amount: number, currency: Currency): string {
  return currency === 'JPY' ? String(Math.round(amount)) : amount.toFixed(2)
}

/** The concrete per-person shares this SplitValue represents. */
export function computeSplits(
  value: SplitValue,
  total: number
): { participantId: string; shareAmount: number }[] {
  if (value.involved.length === 0) return []
  if (value.mode === 'equal') {
    const share = total / value.involved.length
    return value.involved.map((id) => ({ participantId: id, shareAmount: share }))
  }
  return value.involved.map((id) => ({
    participantId: id,
    shareAmount: parseFloat(value.amounts[id] ?? '') || 0,
  }))
}

export function customSum(value: SplitValue): number {
  return value.involved.reduce((sum, id) => sum + (parseFloat(value.amounts[id] ?? '') || 0), 0)
}

/** Is this split ready to save against the given expense total? */
export function splitValidity(value: SplitValue, total: number): { valid: boolean; message?: string } {
  if (value.involved.length === 0) return { valid: false, message: 'Select at least one person to split between.' }
  if (!(total > 0)) return { valid: false } // amount validation handled by the form
  if (value.mode === 'equal') return { valid: true }

  for (const id of value.involved) {
    const n = parseFloat(value.amounts[id] ?? '')
    if (isNaN(n) || n < 0) return { valid: false, message: 'Enter a valid amount for each involved person.' }
  }
  if (Math.abs(customSum(value) - total) > 0.01) {
    return { valid: false, message: 'Split amounts must add up to the total.' }
  }
  return { valid: true }
}
