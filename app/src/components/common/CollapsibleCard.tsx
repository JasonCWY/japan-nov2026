import { useState, type ReactNode } from 'react'

export function CollapsibleCard({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  title: string
  subtitle?: string
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-card rounded-[var(--radius-card)] shadow-[var(--shadow-card)] dark:border dark:border-line overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 p-5 text-left"
        aria-expanded={open}
      >
        <span>
          <span className="block text-lg font-bold text-ink">{title}</span>
          {subtitle && <span className="block text-xs text-ink-muted mt-0.5">{subtitle}</span>}
        </span>
        <span className="text-ink-muted shrink-0">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}
