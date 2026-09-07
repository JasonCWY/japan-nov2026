import type { ReactNode } from 'react'

type Tone = 'blue' | 'green' | 'yellow' | 'red'

const toneClasses: Record<Tone, string> = {
  blue: 'bg-info/10 border-info text-ink dark:bg-info/15',
  green: 'bg-success/10 border-success text-ink dark:bg-success/15',
  yellow: 'bg-warning/10 border-warning text-ink dark:bg-warning/15',
  red: 'bg-primary/10 border-primary text-ink dark:bg-primary/15',
}

export function InfoBox({ tone = 'blue', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <div className={`border-l-4 rounded-md px-4 py-3 text-sm ${toneClasses[tone]}`}>
      {children}
    </div>
  )
}
