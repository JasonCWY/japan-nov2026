import { useState } from 'react'
import type { ChecklistComment, ChecklistItem, ChecklistPriority, Participant } from '../../types/domain'
import { Card } from '../common/Card'
import { ChecklistItemRow } from './ChecklistItemRow'

export function ChecklistSection({
  title,
  priority,
  items,
  participants,
  currentParticipant,
  commentsByItem,
  onToggle,
  onAddComment,
  onDeleteComment,
  onRemove,
  onAdd,
}: {
  title: string
  priority: ChecklistPriority
  items: ChecklistItem[]
  participants: Participant[]
  currentParticipant: Participant | null
  commentsByItem: Map<string, ChecklistComment[]>
  onToggle: (id: string, isDone: boolean) => void
  onAddComment: (itemId: string, body: string) => void
  onDeleteComment: (id: string) => void
  onRemove: (id: string) => void
  onAdd: (priority: ChecklistPriority, label: string) => void
}) {
  const [draft, setDraft] = useState('')

  function submit() {
    if (!draft.trim()) return
    onAdd(priority, draft)
    setDraft('')
  }

  return (
    <Card title={title}>
      <div className="divide-y divide-line">
        {items.map((item) => (
          <ChecklistItemRow
            key={item.id}
            item={item}
            doneByName={participants.find((p) => p.id === item.doneBy)?.name ?? null}
            comments={commentsByItem.get(item.id) ?? []}
            currentParticipant={currentParticipant}
            onToggle={onToggle}
            onAddComment={onAddComment}
            onDeleteComment={onDeleteComment}
            onRemove={onRemove}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-line">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
          placeholder="Add a to-do…"
          className="flex-1 border border-line rounded-lg px-3 py-1.5 text-sm bg-card"
        />
        <button
          type="button"
          onClick={submit}
          disabled={!draft.trim()}
          className="bg-primary text-white text-xs font-semibold rounded-lg px-3 py-2 disabled:opacity-50"
        >
          + Add
        </button>
      </div>
    </Card>
  )
}
