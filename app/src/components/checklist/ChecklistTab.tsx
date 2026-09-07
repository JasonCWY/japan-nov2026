import { useParticipantsAndCategories } from '../../hooks/useParticipantsAndCategories'
import { useChecklist } from '../../hooks/useChecklist'
import { useChecklistComments } from '../../hooks/useChecklistComments'
import { useAuth } from '../../hooks/useAuth'
import { Card } from '../common/Card'
import { ChecklistSection } from './ChecklistSection'

const SECTION_TITLES = {
  high: '🔴 High Priority — Book Immediately',
  medium: '🟡 Medium Priority',
  low: '🟢 Pre-Trip Essentials',
} as const

function ChecklistSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-hidden="true">
      <div className="h-20 bg-line/50 rounded-[var(--radius-card)]" />
      {[0, 1, 2].map((s) => (
        <div key={s} className="bg-card border border-line rounded-[var(--radius-card)] p-5 space-y-3">
          <div className="h-4 bg-line/60 rounded w-1/2" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-3 bg-line/50 rounded w-3/4" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function ChecklistTab() {
  const { participants } = useParticipantsAndCategories()
  const { items, loading, toggleItem, addItem, removeItem } = useChecklist()
  const { byItem, addComment, deleteComment } = useChecklistComments(participants)
  const { participant } = useAuth()

  if (loading) return <ChecklistSkeleton />

  const doneCount = items.filter((i) => i.isDone).length
  const pct = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0
  const highLeft = items.filter((i) => i.priority === 'high' && !i.isDone).length

  function handleToggle(id: string, isDone: boolean) {
    toggleItem(id, isDone, participant?.id)
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <Card>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-sm font-semibold text-ink">Trip prep progress</span>
          <span className="text-sm text-ink-muted">
            {doneCount} / {items.length} done · {pct}%
          </span>
        </div>
        <div className="h-3 bg-line rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${pct === 100 ? 'bg-success' : 'bg-primary'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {highLeft > 0 && (
          <p className="text-xs text-primary mt-2">
            🔴 {highLeft} high-priority {highLeft === 1 ? 'item' : 'items'} still to book.
          </p>
        )}
        {items.length > 0 && doneCount === items.length && (
          <p className="text-xs text-success mt-2">🎉 Everything's done — you're trip-ready!</p>
        )}
      </Card>

      {(Object.keys(SECTION_TITLES) as (keyof typeof SECTION_TITLES)[]).map((priority) => (
        <ChecklistSection
          key={priority}
          title={SECTION_TITLES[priority]}
          priority={priority}
          items={items.filter((i) => i.priority === priority)}
          participants={participants}
          currentParticipant={participant}
          commentsByItem={byItem}
          onToggle={handleToggle}
          onAddComment={(itemId, body) => addComment(itemId, body, participant?.id)}
          onDeleteComment={deleteComment}
          onRemove={removeItem}
          onAdd={addItem}
        />
      ))}
    </div>
  )
}
