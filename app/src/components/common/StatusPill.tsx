type Tone = 'green' | 'orange' | 'red'

const toneClasses: Record<Tone, string> = {
  green: 'bg-success/15 text-success',
  orange: 'bg-warning/15 text-warning',
  red: 'bg-primary/15 text-primary',
}

export function StatusPill({ tone, children }: { tone: Tone; children: string }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}>
      {children}
    </span>
  )
}
