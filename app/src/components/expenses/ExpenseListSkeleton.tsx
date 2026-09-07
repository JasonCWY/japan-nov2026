export function ExpenseListSkeleton() {
  return (
    <div className="space-y-2 animate-pulse" aria-hidden="true">
      <div className="h-10 bg-line/60 rounded-lg" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-card border border-line rounded-lg p-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-line/70" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-line/70 rounded w-2/3" />
              <div className="h-2.5 bg-line/50 rounded w-1/2" />
            </div>
            <div className="h-3 bg-line/70 rounded w-14" />
          </div>
        </div>
      ))}
    </div>
  )
}
