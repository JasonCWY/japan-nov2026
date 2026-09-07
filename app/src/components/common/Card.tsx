import type { ReactNode } from 'react'

export function Card({ title, children, className = '' }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`bg-card rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-5 ${className}`}>
      {title && <h3 className="text-lg font-bold text-ink mb-3">{title}</h3>}
      {children}
    </div>
  )
}
