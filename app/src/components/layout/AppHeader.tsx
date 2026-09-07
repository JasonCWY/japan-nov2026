import { useCountdown } from '../../hooks/useCountdown'
import { ThemeToggle } from './ThemeToggle'

function HeaderCountdown() {
  const cd = useCountdown()
  if (cd.departed) {
    return <div className="text-sm font-semibold text-white">🇯🇵 We're in Japan!</div>
  }
  const units: [string, string][] = [
    ['Days', cd.days],
    ['Hrs', cd.hours],
    ['Min', cd.mins],
    ['Sec', cd.secs],
  ]
  return (
    <div className="flex items-center gap-3">
      {units.map(([label, value]) => (
        <div key={label} className="flex items-baseline gap-1">
          <span className="text-lg font-bold tabular-nums text-white leading-none">{value}</span>
          <span className="text-[10px] text-white/50">{label}</span>
        </div>
      ))}
      <span className="text-[11px] text-white/50 ml-0.5 hidden min-[420px]:inline">to departure</span>
    </div>
  )
}

export function AppHeader({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-br from-secondary via-[#16213e] to-[#0f3460] text-white shadow-md">
      <div className="mx-auto max-w-4xl px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenu}
            aria-label="Open menu"
            className="text-xl -ml-1 p-1 text-white/90 hover:text-white transition-colors"
          >
            ☰
          </button>
          <div className="flex-1 min-w-0">
            <div className="font-bold truncate">🇯🇵 Nov 2026 Japan Trip</div>
            <div className="text-[11px] text-white/60">Tokyo &amp; Osaka · 7–15 Nov 2026</div>
          </div>
          <ThemeToggle onDark />
        </div>
        <div className="mt-2">
          <HeaderCountdown />
        </div>
      </div>
    </header>
  )
}
