import { useCountdown } from '../../hooks/useCountdown'

export function CountdownTimer() {
  const cd = useCountdown()

  if (cd.departed) {
    return (
      <div className="text-center py-2 text-white font-semibold">
        🇯🇵 We're in Japan!
      </div>
    )
  }

  const units = [
    { value: cd.days, label: 'Days' },
    { value: cd.hours, label: 'Hours' },
    { value: cd.mins, label: 'Mins' },
    { value: cd.secs, label: 'Secs' },
  ]

  return (
    <div className="text-center">
      <div className="text-white/70 text-xs uppercase tracking-wide mb-2">Countdown to departure</div>
      <div className="flex justify-center gap-3 sm:gap-5">
        {units.map((u) => (
          <div key={u.label} className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums">{u.value}</div>
            <div className="text-[11px] text-white/60">{u.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
