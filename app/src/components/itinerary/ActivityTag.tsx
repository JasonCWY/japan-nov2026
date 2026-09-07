import type { ActivityTagKind } from '../../data/itinerary'

const kindClasses: Record<ActivityTagKind, string> = {
  theme: 'bg-purple/15 text-purple',
  nature: 'bg-success/15 text-success',
  culture: 'bg-info/15 text-info',
  food: 'bg-warning/15 text-warning',
  shopping: 'bg-primary/15 text-primary',
  transport: 'bg-secondary/10 text-secondary',
}

export function ActivityTag({ kind, label }: { kind: ActivityTagKind; label: string }) {
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold mr-2 ${kindClasses[kind]}`}>
      {label}
    </span>
  )
}
