import { useState } from 'react'
import type { DayEntry } from '../../data/itinerary'
import { RichText } from '../common/RichText'
import { ActivityTag } from './ActivityTag'
import { RouteSegment } from './RouteSegment'
import { ReturnBox } from './ReturnBox'

export function DayAccordion({ entry }: { entry: DayEntry }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="bg-card rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <span className="shrink-0 bg-primary text-white text-xs font-bold rounded-full px-3 py-1">
          Day {entry.day}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-ink">{entry.title}</div>
          <div className="text-xs text-ink-muted">{entry.date}</div>
        </div>
        <span className="hidden sm:inline bg-primary-light text-primary text-xs font-medium rounded-full px-3 py-1 whitespace-nowrap">
          {entry.location}
        </span>
        <span className="text-ink-muted">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-line pt-4">
          <ul className="space-y-2 text-sm">
            {entry.activities.map((a, i) => (
              <li key={i}>
                {a.tag && <ActivityTag kind={a.tag.kind} label={a.tag.label} />}
                <RichText text={a.text} />
              </li>
            ))}
          </ul>

          {entry.halalNote && (
            <div className="mt-3 border-l-4 border-success bg-success/10 rounded-md px-3 py-2 text-sm">
              {entry.halalNote}
            </div>
          )}
          {entry.weatherNote && (
            <div className="mt-3 border-l-4 border-warning bg-warning/10 rounded-md px-3 py-2 text-sm">
              {entry.weatherNote}
            </div>
          )}

          {entry.routeSections.map((section, i) => (
            <RouteSegment key={i} section={section} />
          ))}

          {entry.returnBox && <ReturnBox box={entry.returnBox} />}

          {entry.tip && (
            <div className="mt-3 border-l-4 border-warning bg-warning/10 rounded-md px-3 py-2 text-sm">{entry.tip}</div>
          )}
        </div>
      )}
    </div>
  )
}
