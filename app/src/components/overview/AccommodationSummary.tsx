import { accommodationSummary } from '../../data/overviewMisc'
import { StatusPill } from '../common/StatusPill'

export function AccommodationSummary() {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {accommodationSummary.map((acc) => (
        <div key={acc.title} className="bg-app-bg rounded-lg p-4">
          <div className="font-bold text-sm mb-1">{acc.title}</div>
          <div className="text-xs text-ink-muted">{acc.dates}</div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {acc.pills.map((pill) => (
              <StatusPill key={pill.label} tone={pill.tone}>
                {pill.label}
              </StatusPill>
            ))}
          </div>
          <div className="text-sm mt-2">{acc.perPerson}</div>
        </div>
      ))}
    </div>
  )
}
