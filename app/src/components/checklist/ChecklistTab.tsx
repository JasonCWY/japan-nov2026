import { useParticipantsAndCategories } from '../../hooks/useParticipantsAndCategories'
import { useChecklist } from '../../hooks/useChecklist'
import { useAuth } from '../../hooks/useAuth'
import { StatBox } from '../common/StatBox'
import { ChecklistSection } from './ChecklistSection'

const SECTION_TITLES = {
  high: '🔴 High Priority — Book Immediately',
  medium: '🟡 Medium Priority',
  low: '🟢 Pre-Trip Essentials',
} as const

export function ChecklistTab() {
  const { participants } = useParticipantsAndCategories()
  const { items, loading, toggleItem } = useChecklist()
  const { participant } = useAuth()

  if (loading) {
    return <p className="text-sm text-ink-muted text-center py-6">Loading checklist…</p>
  }

  const doneCount = items.filter((i) => i.isDone).length

  function handleToggle(id: string, isDone: boolean) {
    toggleItem(id, isDone, participant?.id)
  }

  return (
    <div className="space-y-4">
      <StatBox value={`${doneCount} / ${items.length}`} label="Items Done" />

      {(Object.keys(SECTION_TITLES) as (keyof typeof SECTION_TITLES)[]).map((priority) => (
        <ChecklistSection
          key={priority}
          title={SECTION_TITLES[priority]}
          items={items.filter((i) => i.priority === priority)}
          participants={participants}
          onToggle={handleToggle}
        />
      ))}
    </div>
  )
}
