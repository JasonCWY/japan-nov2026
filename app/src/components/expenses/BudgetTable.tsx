import { budgetRows } from '../../data/budgetTable'
import { StatusPill } from '../common/StatusPill'

export function BudgetTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-secondary text-white">
            <th className="text-left px-3 py-2 rounded-l-md">Item</th>
            <th className="text-left px-3 py-2">Per Person (RM)</th>
            <th className="text-left px-3 py-2 rounded-r-md">Status</th>
          </tr>
        </thead>
        <tbody>
          {budgetRows.map((row) => (
            <tr key={row.item} className={`border-b border-line last:border-0 ${row.emphasize ? 'bg-app-bg' : ''}`}>
              <td className={`px-3 py-2 ${row.emphasize ? 'font-bold' : ''}`}>{row.item}</td>
              <td className={`px-3 py-2 ${row.emphasize ? 'font-bold' : 'text-ink-muted'}`}>{row.perPerson}</td>
              <td className="px-3 py-2">
                {row.status ? (
                  <StatusPill tone={row.status.tone}>{row.status.label}</StatusPill>
                ) : (
                  <span className="text-ink-muted text-xs">{row.statusText}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
