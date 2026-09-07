import type { ReturnBox as ReturnBoxData } from '../../data/itinerary'
import { RichText } from '../common/RichText'

const badgeClasses: Record<ReturnBoxData['items'][number]['badge'], string> = {
  main: 'bg-success/15 text-success',
  alt: 'bg-info/15 text-info',
  note: 'bg-warning/15 text-warning',
}

const badgeLabel: Record<ReturnBoxData['items'][number]['badge'], string> = {
  main: 'Main',
  alt: 'Alt',
  note: 'Note',
}

export function ReturnBox({ box }: { box: ReturnBoxData }) {
  return (
    <div className="mt-4 bg-app-bg rounded-lg p-3 border border-line">
      <div className="text-sm font-bold text-ink mb-2">{box.title}</div>
      <div className="space-y-1.5">
        {box.items.map((item, i) => (
          <div key={i} className="text-sm flex items-start gap-2">
            <span className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-semibold ${badgeClasses[item.badge]}`}>
              {badgeLabel[item.badge]}
            </span>
            <span>
              <RichText text={item.text} />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
