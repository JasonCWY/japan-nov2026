export function StatBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-card rounded-[var(--radius-card)] shadow-[var(--shadow-card)] dark:border dark:border-line p-4 text-center">
      <div className="text-2xl font-bold text-primary">{value}</div>
      <div className="text-sm text-ink-muted mt-1">{label}</div>
    </div>
  )
}
