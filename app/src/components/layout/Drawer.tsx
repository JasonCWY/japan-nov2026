import { useState } from 'react'
import type { TabId } from '../../types/domain'
import { SECTIONS, accentText } from '../../config/sections'
import { members } from '../../data/members'
import { useAuth } from '../../hooks/useAuth'
import { ThemeToggle } from './ThemeToggle'
import { ChangePinModal } from './ChangePinModal'

export function Drawer({
  open,
  onClose,
  active,
  onNavigate,
}: {
  open: boolean
  onClose: () => void
  active: TabId
  onNavigate: (tab: TabId) => void
}) {
  const { participant, signOut } = useAuth()
  const me = members.find((m) => m.name === participant?.name)
  const [showChangePin, setShowChangePin] = useState(false)

  return (
    <>
      {/* backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[82%] bg-card shadow-2xl flex flex-col transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-label="Menu"
      >
        {/* profile */}
        <div className="p-5 border-b border-line flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
            style={{ background: me?.color ?? 'var(--color-primary)' }}
          >
            {me?.initials ?? participant?.name?.charAt(0) ?? '?'}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-ink truncate">{participant?.name ?? '…'}</div>
            <div className="text-xs text-ink-muted">Signed in</div>
          </div>
        </div>

        {/* nav */}
        <nav className="flex-1 overflow-y-auto p-2">
          {SECTIONS.map((s) => {
            const isActive = s.id === active
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onNavigate(s.id)}
                className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left transition-colors ${
                  isActive ? 'bg-app-bg font-semibold text-ink' : 'text-ink-muted hover:bg-app-bg hover:text-ink'
                }`}
              >
                <span className={`text-lg leading-none ${isActive ? accentText[s.accent] : ''}`}>{s.icon}</span>
                <span className="flex-1">{s.label}</span>
                {isActive && <span className={`w-1.5 h-1.5 rounded-full ${accentText[s.accent]} bg-current`} />}
              </button>
            )
          })}

          <div className="my-2 border-t border-line" />
          <button
            type="button"
            onClick={() => setShowChangePin(true)}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-left text-ink-muted hover:bg-app-bg hover:text-ink transition-colors"
          >
            <span className="text-lg leading-none">🔑</span>
            <span className="flex-1">Change PIN</span>
          </button>
        </nav>

        {/* footer */}
        <div className="p-4 border-t border-line flex items-center justify-between">
          <ThemeToggle withLabel />
          <button
            type="button"
            onClick={signOut}
            className="text-sm font-medium text-ink-muted hover:text-primary transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      <ChangePinModal open={showChangePin} onClose={() => setShowChangePin(false)} />
    </>
  )
}
