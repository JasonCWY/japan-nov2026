import { useState } from 'react'
import type { ChecklistComment, ChecklistItem, Participant } from '../../types/domain'

const priorityBadge: Record<ChecklistItem['priority'], { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-primary/15 text-primary' },
  medium: { label: 'Medium', className: 'bg-warning/15 text-warning' },
  low: { label: 'Low', className: 'bg-success/15 text-success' },
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function ChecklistItemRow({
  item,
  doneByName,
  comments,
  currentParticipant,
  onToggle,
  onAddComment,
  onDeleteComment,
  onRemove,
}: {
  item: ChecklistItem
  doneByName: string | null
  comments: ChecklistComment[]
  currentParticipant: Participant | null
  onToggle: (id: string, isDone: boolean) => void
  onAddComment: (itemId: string, body: string) => void
  onDeleteComment: (id: string) => void
  onRemove: (id: string) => void
}) {
  const badge = priorityBadge[item.priority]
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [removeStage, setRemoveStage] = useState<0 | 1 | 2>(0)

  function submit() {
    if (!draft.trim()) return
    onAddComment(item.id, draft)
    setDraft('')
  }

  return (
    <div className="py-2.5">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={item.isDone}
          onChange={(e) => onToggle(item.id, e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-primary shrink-0"
          aria-label={item.label}
        />
        <div className="flex-1 min-w-0">
          <div className={`text-sm ${item.isDone ? 'line-through text-ink-muted' : 'text-ink'}`}>{item.label}</div>
          {item.isDone && doneByName && <div className="text-[11px] text-ink-muted mt-0.5">✓ Done by {doneByName}</div>}
        </div>
        <span className={`shrink-0 text-[10px] font-semibold rounded-full px-2 py-0.5 ${badge.className}`}>{badge.label}</span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`shrink-0 text-xs font-medium transition-colors ${
            comments.length > 0 ? 'text-info' : 'text-ink-muted'
          } hover:text-ink`}
          aria-label="Comments"
        >
          💬{comments.length > 0 ? ` ${comments.length}` : ''}
        </button>
        <button
          type="button"
          onClick={() => setRemoveStage(1)}
          className="shrink-0 text-xs text-ink-muted hover:text-primary transition-colors"
          aria-label="Remove item"
        >
          🗑️
        </button>
      </div>

      {/* Double-confirm removal */}
      {removeStage > 0 && (
        <div className="mt-2 ml-7 flex items-center justify-between gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 flex-wrap">
          <span className="text-xs text-ink">
            {removeStage === 1 ? 'Remove this item?' : '⚠️ This permanently deletes it for everyone. Sure?'}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => (removeStage === 1 ? setRemoveStage(2) : (onRemove(item.id), setRemoveStage(0)))}
              className="bg-primary text-white text-xs font-semibold rounded-md px-3 py-1"
            >
              {removeStage === 1 ? 'Remove' : 'Yes, delete'}
            </button>
            <button
              type="button"
              onClick={() => setRemoveStage(0)}
              className="border border-line text-ink-muted text-xs font-semibold rounded-md px-3 py-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {open && (
        <div className="mt-2 ml-7 space-y-2">
          {comments.length === 0 && <p className="text-[11px] text-ink-muted">No comments yet.</p>}
          {comments.map((c) => {
            const mine = c.participantId === currentParticipant?.id
            return (
              <div key={c.id} className="bg-app-bg rounded-lg px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-semibold ${mine ? 'text-primary' : 'text-ink'}`}>
                    {mine ? 'You' : c.authorName}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] text-ink-muted">{fmtTime(c.createdAt)}</span>
                    {mine && (
                      <button
                        type="button"
                        onClick={() => onDeleteComment(c.id)}
                        className="text-[10px] text-ink-muted hover:text-primary"
                        aria-label="Delete comment"
                      >
                        ✕
                      </button>
                    )}
                  </span>
                </div>
                <div className="text-sm text-ink mt-0.5 whitespace-pre-wrap break-words">{c.body}</div>
              </div>
            )
          })}

          <div className="flex items-center gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit()
              }}
              placeholder="Add a comment…"
              className="flex-1 border border-line rounded-lg px-3 py-1.5 text-sm bg-card"
            />
            <button
              type="button"
              onClick={submit}
              disabled={!draft.trim()}
              className="bg-primary text-white text-xs font-semibold rounded-lg px-3 py-2 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
