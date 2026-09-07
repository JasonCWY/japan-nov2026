import type { HalalHotspot } from '../../data/halal'

export function HalalHotspotTable({ rows }: { rows: HalalHotspot[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-secondary text-white">
            <th className="text-left px-3 py-2 rounded-l-md">Area</th>
            <th className="text-left px-3 py-2">What to Look For</th>
            <th className="text-left px-3 py-2 rounded-r-md">Tips</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.area} className="border-b border-line last:border-0">
              <td className="px-3 py-2 font-semibold whitespace-nowrap">{row.area}</td>
              <td className="px-3 py-2 text-ink-muted">{row.lookFor}</td>
              <td className="px-3 py-2 text-ink-muted">{row.tips}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
