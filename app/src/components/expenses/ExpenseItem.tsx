import { useState } from 'react'
import type { Category, Expense } from '../../types/domain'
import { categoryDisplay } from '../../lib/categoryDisplay'
import { fmtAmt, fmtPer } from '../../lib/format'

export function ExpenseItem({
  expense,
  categories,
  participantCount,
  onSave,
  onDelete,
}: {
  expense: Expense
  categories: Category[]
  participantCount: number
  onSave: (id: string, input: { desc: string; amount: number; currency: Expense['currency']; cat: string; notes: string }) => Promise<{ error: string | null }>
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [desc, setDesc] = useState(expense.desc)
  const [currency, setCurrency] = useState(expense.currency)
  const [amount, setAmount] = useState(String(expense.amount))
  const [cat, setCat] = useState(expense.cat)
  const [notes, setNotes] = useState(expense.notes)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    const parsedAmount = parseFloat(amount)
    if (!desc.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a description and a valid amount.')
      return
    }
    setSaving(true)
    const { error } = await onSave(expense.id, { desc: desc.trim(), amount: parsedAmount, currency, cat, notes: notes.trim() })
    setSaving(false)
    if (error) {
      setError(error)
      return
    }
    setEditing(false)
  }

  const inputClass = 'border border-line rounded-md px-2 py-1.5 text-sm bg-card'

  if (editing) {
    return (
      <div className="flex flex-col gap-2 p-3 bg-app-bg rounded-lg">
        <div className="flex flex-wrap gap-2">
          <input className={`${inputClass} flex-[2] min-w-[140px]`} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" />
          <select className={`${inputClass} w-20`} value={currency} onChange={(e) => setCurrency(e.target.value as Expense['currency'])}>
            <option value="RM">RM</option>
            <option value="JPY">¥</option>
          </select>
          <input className={`${inputClass} w-24`} type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <select className={`${inputClass} flex-1 min-w-[130px]`} value={cat} onChange={(e) => setCat(e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={categoryDisplay(c)}>
                {categoryDisplay(c)}
              </option>
            ))}
          </select>
        </div>
        <input
          className={`${inputClass} w-full`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes / remarks (optional)"
        />
        {error && <p className="text-sm text-primary">{error}</p>}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-white text-xs font-semibold rounded-md px-3 py-1.5 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="border border-line text-ink-muted text-xs font-semibold rounded-md px-3 py-1.5"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 p-3">
      <div className="text-xl shrink-0">{expense.cat.trim().charAt(0)}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm text-ink">{expense.desc}</span>
          <span className="text-[10px] text-ink-muted border border-line rounded px-1.5 py-0.5">{expense.currency === 'JPY' ? '¥' : 'RM'}</span>
          {expense.seeded && (
            <span className="text-[10px] text-ink-muted bg-line rounded px-1.5 py-0.5">Pre-loaded</span>
          )}
        </div>
        <div className="text-xs text-ink-muted mt-0.5">
          Paid by {expense.paidBy} · {expense.cat} · {fmtPer(expense.currency, expense.amount, participantCount)} each
        </div>
        {expense.notes && <div className="text-xs text-ink-muted italic mt-1">{expense.notes}</div>}
      </div>
      <div className="text-right shrink-0">
        <div className="font-bold text-sm text-ink">{fmtAmt(expense.currency, expense.amount)}</div>
        <div className="flex gap-2 justify-end mt-1">
          <button type="button" onClick={() => setEditing(true)} className="text-ink-muted hover:text-ink text-sm" aria-label="Edit">
            ✏️
          </button>
          {!expense.seeded && (
            <button type="button" onClick={() => onDelete(expense.id)} className="text-ink-muted hover:text-primary text-sm" aria-label="Delete">
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
