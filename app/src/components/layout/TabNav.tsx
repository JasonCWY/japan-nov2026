import type { TabId } from '../../types/domain'

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '📋' },
  { id: 'itinerary', label: 'Itinerary', icon: '🗺️' },
  { id: 'expenses', label: 'Expenses', icon: '💰' },
  { id: 'checklist', label: 'Checklist', icon: '✅' },
  { id: 'halal', label: 'Halal Guide', icon: '🕌' },
]

export function TabNav({ active, onChange }: { active: TabId; onChange: (tab: TabId) => void }) {
  return (
    <nav className="sticky top-0 z-10 bg-card border-b border-line overflow-x-auto">
      <div className="flex mx-auto max-w-4xl">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              active === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
