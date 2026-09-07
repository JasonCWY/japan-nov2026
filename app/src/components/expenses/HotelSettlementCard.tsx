import type { HotelSettlement } from '../../data/hotelSettlement'
import { Card } from '../common/Card'
import { StatBox } from '../common/StatBox'
import { InfoBox } from '../common/InfoBox'
import { StatusPill } from '../common/StatusPill'

const barColor: Record<string, string> = {
  full: 'bg-success',
  partial: 'bg-warning',
  unpaid: 'bg-primary',
}

const pillTone: Record<string, 'green' | 'orange' | 'red'> = {
  full: 'green',
  partial: 'orange',
  unpaid: 'red',
}

const pillLabel: Record<string, string> = {
  full: '✅ Full',
  partial: '⚠️ Partial',
  unpaid: '❌ Unpaid',
}

export function HotelSettlementCard({ settlement }: { settlement: HotelSettlement }) {
  return (
    <Card title={settlement.title}>
      <InfoBox tone="green">
        💳 Hotel paid by <strong>{settlement.payer}</strong>. All members reimburse {settlement.payer} for their share.
      </InfoBox>

      <div className="grid grid-cols-3 gap-3 my-4">
        <StatBox value={`RM ${settlement.perPerson.toFixed(2)}`} label="Per Person" />
        <StatBox value={`RM ${settlement.collected.toFixed(2)}`} label={`Collected by ${settlement.payer}`} />
        <StatBox value={`RM ${settlement.owed.toFixed(2)}`} label={`Still Owed to ${settlement.payer}`} />
      </div>

      <div className="divide-y divide-line">
        {settlement.members.map((m) => (
          <div key={m.name} className="flex flex-wrap items-center gap-3 py-3">
            <div
              className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ background: m.color }}
            >
              {m.initials}
            </div>
            <div className="min-w-[110px]">
              <div className="font-semibold text-sm text-ink">{m.name}</div>
              {m.badge && <div className="text-[11px] text-ink-muted">{m.badge}</div>}
            </div>
            <div className="flex-1 min-w-[140px]">
              <div className="h-2 bg-line rounded-full overflow-hidden">
                <div className={`h-full ${barColor[m.status]}`} style={{ width: `${m.percent}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-ink-muted mt-0.5">
                <span>{m.isPayer ? 'Share covered (payer)' : `Paid: RM ${m.paid.toFixed(2)}`}</span>
                <span>{m.percent}%</span>
              </div>
            </div>
            <div className="text-right text-xs min-w-[110px]">
              <div className="font-semibold">RM {m.paid.toFixed(2)}</div>
              <div className={m.outstanding > 0 ? 'text-primary' : 'text-ink-muted'}>
                {m.outstanding > 0 ? `RM ${m.outstanding.toFixed(2)} outstanding` : 'RM 0 remaining'}
              </div>
            </div>
            <StatusPill tone={pillTone[m.status]}>{pillLabel[m.status]}</StatusPill>
          </div>
        ))}
      </div>
    </Card>
  )
}
