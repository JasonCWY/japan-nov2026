import type { FlightCard as FlightCardData } from '../../data/flights'

export function FlightCard({ flight }: { flight: FlightCardData }) {
  return (
    <div className="bg-secondary text-white rounded-lg p-4 mt-3 first:mt-0">
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-white/15 rounded px-2 py-0.5 text-xs font-bold">PR</span>
        <span className="font-semibold">{flight.label}</span>
        <span className="ml-auto text-success text-xs font-medium">{flight.status}</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {flight.route.map((stop, i) => (
          <span key={stop.code} className="flex items-center gap-2">
            {i > 0 && <span className="text-white/40">✈</span>}
            <span className="text-center">
              <div className="font-bold text-sm">{stop.code}</div>
              <div className="text-[10px] text-white/60 whitespace-nowrap">{stop.name}</div>
            </span>
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 pt-3 border-t border-white/10 text-xs">
        {flight.meta.map((m) => (
          <div key={m.label}>
            <div className="text-white/50">{m.label}</div>
            <div className="font-medium">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
