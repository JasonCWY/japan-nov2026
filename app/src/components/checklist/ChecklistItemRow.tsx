import type { ChecklistItem } from '../../types/domain'

const priorityBadge: Record<ChecklistItem['priority'], { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-primary/15 text-primary' },
  medium: { label: 'Medium', className: 'bg-warning/15 text-warning' },
  low: { label: 'Low', className: 'bg-success/15 text-success' },
}

export function ChecklistItemRow({
  item,
  doneByName,
  onToggle,
}: {
  item: ChecklistItem
  doneByName: string | null
  onToggle: (id: string, isDone: boolean) => void
}) {
  const badge = priorityBadge[item.priority]

  return (
    <label className="flex items-start gap-3 py-2.5 cursor-pointer">
      <input
        type="checkbox"
        checked={item.isDone}
        onChange={(e) => onToggle(item.id, e.target.checked)}
        className="mt-0.5 w-4 h-4 accent-primary shrink-0"
      />
      <span className="flex-1">
        <span className={`text-sm ${item.isDone ? 'line-through text-ink-muted' : 'text-ink'}`}>{item.label}</span>
        {item.isDone && doneByName && <span className="block text-[11px] text-ink-muted mt-0.5">✓ Done by {doneByName}</span>}
      </span>
      <span className={`shrink-0 text-[10px] font-semibold rounded-full px-2 py-0.5 ${badge.className}`}>{badge.label}</span>
    </label>
  )
}
