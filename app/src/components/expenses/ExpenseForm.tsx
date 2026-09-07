import { useState, type FormEvent } from 'react'
import type { Category, Currency, Participant } from '../../types/domain'
import { categoryDisplay } from '../../lib/categoryDisplay'
import type { ExpenseInput } from '../../hooks/useExpenses'
import { useAuth } from '../../hooks/useAuth'

export function ExpenseForm({
  participants,
  categories,
  onAdd,
}: {
  participants: Participant[]
  categories: Category[]
  onAdd: (input: ExpenseInput) => Promise<{ error: string | null }>
}) {
  const { participant } = useAuth()
  const [desc, setDesc] = useState('')
  const [currency, setCurrency] = useState<Currency>('RM')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState(participant?.name ?? participants[0]?.name ?? '')
  const [cat, setCat] = useState(categories[0] ? categoryDisplay(categories[0]) : '')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const effectivePaidBy = paidBy || participant?.name || participants[0]?.name || ''
  const effectiveCat = cat || (categories[0] ? categoryDisplay(categories[0]) : '')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const parsedAmount = parseFloat(amount)
    if (!desc.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a description and a valid amount.')
      return
    }
    setSubmitting(true)
    setError(null)
    const { error } = await onAdd({
      desc: desc.trim(),
      amount: parsedAmount,
      currency,
      paidBy: effectivePaidBy,
      cat: effectiveCat,
      notes: notes.trim(),
    })
    setSubmitting(false)
    if (error) {
      setError(error)
      return
    }
    setDesc('')
    setAmount('')
    setNotes('')
  }

  const inputClass = 'w-full border border-line rounded-lg px-3 py-2 text-sm bg-card'
  const labelClass = 'block text-xs font-medium text-ink-muted mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-app-bg rounded-lg p-4">
      <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-3">
        <div>
          <label className={labelClass}>Description</label>
          <input
            className={inputClass}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="e.g. DisneySea tickets x6"
          />
        </div>
        <div className="w-full sm:w-24">
          <label className={labelClass}>Currency</label>
          <select className={inputClass} value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
            <option value="RM">RM</option>
            <option value="JPY">¥ (Yen)</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Amount</label>
          <input
            className={inputClass}
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Paid By</label>
          <select className={inputClass} value={effectivePaidBy} onChange={(e) => setPaidBy(e.target.value)}>
            {participants.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select className={inputClass} value={effectiveCat} onChange={(e) => setCat(e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={categoryDisplay(c)}>
                {categoryDisplay(c)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Notes / Remarks (optional)</label>
          <input
            className={inputClass}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. paid cash, split 3-way, receipt #..."
          />
        </div>
      </div>

      {error && <p className="text-sm text-primary">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-primary text-white font-semibold rounded-lg px-4 py-2 text-sm disabled:opacity-50"
      >
        {submitting ? 'Adding…' : '+ Add Expense'}
      </button>
    </form>
  )
}
