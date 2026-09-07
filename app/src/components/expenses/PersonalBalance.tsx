import type { Currency, Expense, Participant } from '../../types/domain'
import { useAuth } from '../../hooks/useAuth'
import { fmtAmt } from '../../lib/format'
import { computeBalances } from '../../lib/settle'

export function PersonalBalance({ expenses, participants }: { expenses: Expense[]; participants: Participant[] }) {
  const { participant } = useAuth()
  if (!participant) return null

  const bal = computeBalances(expenses, participants).get(participant.id) ?? { RM: 0, JPY: 0 }
  const currencies: Currency[] = ['RM', 'JPY']
  const nonZero = currencies.filter((c) => Math.abs(bal[c]) > 0.01)

  return (
    <div className="bg-gradient-to-br from-secondary to-[#0f3460] text-white rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-5">
      <div className="text-sm text-white/70">Hi {participant.name} 👋</div>
      {nonZero.length === 0 ? (
        <div className="text-lg font-bold mt-1">You're all settled up ✅</div>
      ) : (
        <div className="mt-2 space-y-1.5">
          {nonZero.map((c) => {
            const amt = bal[c]
            const owed = amt > 0
            return (
              <div key={c} className="flex items-baseline gap-2">
                <span className={`text-xl font-bold ${owed ? 'text-[#6ee7a8]' : 'text-[#ff9aa8]'}`}>
                  {fmtAmt(c, Math.abs(amt))}
                </span>
                <span className="text-sm text-white/75">{owed ? "you're owed" : 'you owe'}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
