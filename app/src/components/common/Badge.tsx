import type { ReactNode } from 'react'

type Tone = 'default' | 'green' | 'orange' | 'red'

const toneClasses: Record<Tone, string> = {
  default: 'bg-white/15 border-white/25 text-white',
  green: 'bg-success/20 border-success/40 text-success',
  orange: 'bg-warning/20 border-warning/40 text-warning',
  red: 'bg-primary/20 border-primary/40 text-primary',
}

export function Badge({ tone = 'default', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-block border rounded-full px-3 py-1 text-xs font-medium ${toneClasses[tone]}`}>
      {children}
    </span>
  )
}
