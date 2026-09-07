import type { Currency, Expense, Participant } from '../../types/domain'
import { useAuth } from '../../hooks/useAuth'
import { fmtAmt } from '../../lib/format'
import { settleUp, type Transfer } from '../../lib/settle'

function TransferRow({ t, meId }: { t: Transfer; meId: string | undefined }) {
  const involvesMe = t.fromId === meId || t.toId === meId
  return (
    <div
      className={`flex items-center justify-between gap-2 py-2 text-sm rounded-md px-2 ${
        involvesMe ? 'bg-primary/10' : ''
      }`}
    >
      <span className="flex items-center gap-1.5 min-w-0">
        <span className={`font-medium ${t.fromId === meId ? 'text-primary' : 'text-ink'}`}>
          {t.fromId === meId ? 'You' : t.fromName}
        </span>
        <span className="text-ink-muted">→</span>
        <span className={`font-medium ${t.toId === meId ? 'text-primary' : 'text-ink'}`}>
          {t.toId === meId ? 'You' : t.toName}
        </span>
      </span>
      <span className="font-semibold tabular-nums shrink-0">{fmtAmt(t.currency, t.amount)}</span>
    </div>
  )
}

export function SettleUp({ expenses, participants }: { expenses: Expense[]; participants: Participant[] }) {
  const { participant } = useAuth()
  const currencies: Currency[] = ['RM', 'JPY']
  const groups = currencies
    .map((c) => ({ currency: c, transfers: settleUp(expenses, participants, c) }))
    .filter((g) => g.transfers.length > 0)

  return (
    <div className="bg-card rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-5">
      <h3 className="text-lg font-bold text-ink mb-1">🤝 Settle Up</h3>
      <p className="text-xs text-ink-muted mb-3">Fewest transfers to clear everyone's balance.</p>
      {groups.length === 0 ? (
        <div className="text-sm text-success">✅ Everyone's settled up — no transfers needed.</div>
      ) : (
        <div className="space-y-3">
          {groups.map((g) => (
            <div key={g.currency}>
              <div className="text-xs font-semibold text-ink-muted mb-1">{g.currency === 'JPY' ? '¥ Yen' : 'RM Ringgit'}</div>
              <div className="divide-y divide-line">
                {g.transfers.map((t, i) => (
                  <TransferRow key={i} t={t} meId={participant?.id} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
