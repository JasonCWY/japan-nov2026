import { Badge } from '../common/Badge'
import { CountdownTimer } from './CountdownTimer'

export function Hero() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-secondary via-[#16213e] to-[#0f3460] px-6 py-8 text-white">
      <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-8xl opacity-15">
        ⛩️
      </div>
      <div className="relative mx-auto max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold">🇯🇵 Nov 2026 Japan Trip Dashboard</h1>
        <p className="text-white/75 text-sm sm:text-base mt-1">Tokyo &amp; Osaka · 7–15 Nov 2026</p>

        <div className="flex flex-wrap gap-2 mt-4">
          <Badge tone="green">✅ Flights Booked</Badge>
          <Badge tone="green">✅ Tokyo Hotel Booked</Badge>
          <Badge tone="orange">⏳ Osaka Hotel TBC</Badge>
          <Badge tone="orange">⏳ Shinkansen Not Booked</Badge>
        </div>

        <div className="mt-6">
          <CountdownTimer />
        </div>
      </div>
    </header>
  )
}
