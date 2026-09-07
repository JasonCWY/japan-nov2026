import type { ReactNode } from 'react'

type Tone = 'blue' | 'green' | 'yellow' | 'red'

const toneClasses: Record<Tone, string> = {
  blue: 'bg-blue-50 border-info text-blue-900',
  green: 'bg-green-50 border-success text-green-900',
  yellow: 'bg-yellow-50 border-warning text-yellow-900',
  red: 'bg-red-50 border-primary text-red-900',
}

export function InfoBox({ tone = 'blue', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <div className={`border-l-4 rounded-md px-4 py-3 text-sm ${toneClasses[tone]}`}>
      {children}
    </div>
  )
}
