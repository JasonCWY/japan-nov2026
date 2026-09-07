import type { ChecklistItem, Participant } from '../../types/domain'
import { Card } from '../common/Card'
import { ChecklistItemRow } from './ChecklistItemRow'

export function ChecklistSection({
  title,
  items,
  participants,
  onToggle,
}: {
  title: string
  items: ChecklistItem[]
  participants: Participant[]
  onToggle: (id: string, isDone: boolean) => void
}) {
  if (items.length === 0) return null

  return (
    <Card title={title}>
      <div className="divide-y divide-line">
        {items.map((item) => (
          <ChecklistItemRow
            key={item.id}
            item={item}
            doneByName={participants.find((p) => p.id === item.doneBy)?.name ?? null}
            onToggle={onToggle}
          />
        ))}
      </div>
    </Card>
  )
}
