import type { Currency, Participant } from '../../types/domain'
import { fmtAmt } from '../../lib/format'
import { customSum, shareString, splitValidity, type SplitValue } from '../../lib/splits'

export function SplitEditor({
  participants,
  total,
  currency,
  value,
  onChange,
}: {
  participants: Participant[]
  total: number
  currency: Currency
  value: SplitValue
  onChange: (next: SplitValue) => void
}) {
  const involvedSet = new Set(value.involved)
  const equalShare = value.involved.length > 0 ? total / value.involved.length : 0

  function toggleInvolved(id: string) {
    const involved = involvedSet.has(id)
      ? value.involved.filter((x) => x !== id)
      : [...value.involved, id]
    onChange({ ...value, involved })
  }

  function setMode(mode: SplitValue['mode']) {
    if (mode === 'custom') {
      // seed the custom boxes with the current equal split so people only tweak what differs
      const amounts = { ...value.amounts }
      value.involved.forEach((id) => {
        if (!amounts[id]) amounts[id] = shareString(equalShare, currency)
      })
      onChange({ ...value, mode, amounts })
    } else {
      onChange({ ...value, mode })
    }
  }

  function setAmount(id: string, raw: string) {
    onChange({ ...value, amounts: { ...value.amounts, [id]: raw } })
  }

  const validity = splitValidity(value, total)
  const sum = customSum(value)

  return (
    <div className="bg-card rounded-lg p-3 border border-line space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-xs font-medium text-ink-muted">Split between</span>
        <div className="flex rounded-lg border border-line overflow-hidden text-xs">
          {(['equal', 'custom'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setMode(mode)}
              className={`px-3 py-1 font-medium ${
                value.mode === mode ? 'bg-primary text-white' : 'bg-card text-ink-muted'
              }`}
            >
              {mode === 'equal' ? 'Equal' : 'Custom'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        {participants.map((p) => {
          const involved = involvedSet.has(p.id)
          return (
            <div key={p.id} className="flex items-center gap-2">
              <label className="flex items-center gap-2 flex-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={involved}
                  onChange={() => toggleInvolved(p.id)}
                  className="w-4 h-4 accent-primary"
                />
                <span className={`text-sm ${involved ? 'text-ink' : 'text-ink-muted line-through'}`}>{p.name}</span>
              </label>
              {involved &&
                (value.mode === 'equal' ? (
                  <span className="text-xs text-ink-muted tabular-nums">{fmtAmt(currency, equalShare)}</span>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-ink-muted">{currency === 'JPY' ? '¥' : 'RM'}</span>
                    <input
                      type="number"
                      step="0.01"
                      value={value.amounts[p.id] ?? ''}
                      onChange={(e) => setAmount(p.id, e.target.value)}
                      className="w-24 border border-line rounded-md px-2 py-1 text-sm"
                      placeholder="0.00"
                    />
                  </div>
                ))}
            </div>
          )
        })}
      </div>

      {value.mode === 'custom' && total > 0 && (
        <div
          className={`text-xs flex justify-between ${
            Math.abs(sum - total) > 0.01 ? 'text-primary' : 'text-success'
          }`}
        >
          <span>Assigned: {fmtAmt(currency, sum)}</span>
          <span>Total: {fmtAmt(currency, total)}</span>
        </div>
      )}

      {!validity.valid && validity.message && <p className="text-xs text-primary">{validity.message}</p>}
    </div>
  )
}
