import type { RouteSection } from '../../data/itinerary'

export function RouteSegment({ section }: { section: RouteSection }) {
  return (
    <div className="mt-4">
      <div className="text-sm font-bold text-secondary dark:text-white flex items-center flex-wrap gap-1">
        {section.heading}
        {section.badge && (
          <span
            className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${
              section.badge.tone === 'red' ? 'bg-primary/15 text-primary' : 'bg-success/15 text-success'
            }`}
          >
            {section.badge.label}
          </span>
        )}
      </div>
      <div className="mt-2 space-y-2">
        {section.segs.map((seg, i) => (
          <div key={i} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            {seg.nodes.map((node, j) => (
              <span key={j} className="flex items-center gap-2">
                {j > 0 && <span className="text-ink-muted">→</span>}
                <span className="bg-primary-light text-primary rounded-full px-3 py-1 font-medium whitespace-nowrap">
                  {node}
                </span>
              </span>
            ))}
            <span className="text-ink-muted text-xs ml-1">{seg.label}</span>
          </div>
        ))}
      </div>
      {section.note && <div className="text-xs italic text-ink-muted mt-2">{section.note}</div>}
    </div>
  )
}
