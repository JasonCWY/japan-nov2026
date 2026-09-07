import { shinkansenNote, suicaNote } from '../../data/overviewMisc'

export function TransportQuickRef() {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <div className="bg-app-bg rounded-lg p-4">
        <div className="font-bold text-sm mb-1.5 flex items-center gap-2 flex-wrap">
          {shinkansenNote.title}
          <span className="bg-primary/15 text-primary text-[10px] font-semibold rounded-full px-2 py-0.5">
            {shinkansenNote.badge}
          </span>
        </div>
        <div className="text-xs text-ink-muted space-y-1">
          {shinkansenNote.lines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
        <div className="mt-2 border-l-4 border-success bg-success/10 rounded-r-md px-2.5 py-1.5 text-xs">
          {shinkansenNote.confirmation}
        </div>
      </div>
      <div className="bg-app-bg rounded-lg p-4">
        <div className="font-bold text-sm mb-1.5">{suicaNote.title}</div>
        <div className="text-xs text-ink-muted space-y-1">
          {suicaNote.lines.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
        <div className="mt-2 border-l-4 border-warning bg-warning/10 rounded-r-md px-2.5 py-1.5 text-xs">
          {suicaNote.warning}
        </div>
      </div>
    </div>
  )
}
