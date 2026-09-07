import type { TabId } from '../../types/domain'
import { accentChip, sectionById } from '../../config/sections'

export function SectionHeader({ section }: { section: TabId }) {
  const meta = sectionById(section)
  return (
    <div className="flex items-center gap-3">
      <span className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl ${accentChip[meta.accent]}`}>
        {meta.icon}
      </span>
      <div>
        <h2 className="text-xl font-bold text-ink leading-tight">{meta.label}</h2>
        <p className="text-xs text-ink-muted">{meta.subtitle}</p>
      </div>
    </div>
  )
}
