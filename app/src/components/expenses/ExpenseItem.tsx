import { useEffect, useState } from 'react'
import type { Category, Currency, Expense, Participant, SplitShare } from '../../types/domain'
import { categoryDisplay } from '../../lib/categoryDisplay'
import { fmtAmt } from '../../lib/format'
import { computeSplits, shareString, splitFromShares, splitValidity, type SplitValue } from '../../lib/splits'
import type { ExpenseEditInput } from '../../hooks/useExpenses'
import { useAuth } from '../../hooks/useAuth'
import { SplitEditor } from './SplitEditor'

const SETTLE_EPSILON = 0.005

function SplitPaymentRow({
  split,
  currency,
  isPayer,
  isMe,
  onSetPaid,
}: {
  split: SplitShare
  currency: Currency
  isPayer: boolean
  isMe: boolean
  onSetPaid: (paidAmount: number) => void
}) {
  const [val, setVal] = useState(shareString(split.paidAmount, currency))
  useEffect(() => {
    setVal(shareString(split.paidAmount, currency))
  }, [split.paidAmount, currency])

  const pct = split.shareAmount > 0 ? Math.min(100, Math.max(0, (split.paidAmount / split.shareAmount) * 100)) : 0
  const left = Math.max(0, split.shareAmount - split.paidAmount)
  const settled = split.paidAmount >= split.shareAmount - SETTLE_EPSILON
  const status: 'full' | 'partial' | 'unpaid' =
    settled ? 'full' : split.paidAmount <= SETTLE_EPSILON ? 'unpaid' : 'partial'

  const pill =
    status === 'full'
      ? { cls: 'bg-success/15 text-success', label: '✅ Settled' }
      : status === 'partial'
        ? { cls: 'bg-warning/15 text-warning', label: '⚠️ Partial' }
        : { cls: 'bg-primary/15 text-primary', label: '❌ Unpaid' }

  function commit(raw: string) {
    const n = parseFloat(raw)
    onSetPaid(isNaN(n) ? 0 : n)
  }

  const nameEl = (
    <span className={`text-sm font-medium ${isMe ? 'text-primary' : 'text-ink'}`}>
      {split.participantName}
      {isMe && <span className="text-[11px] font-normal"> (you)</span>}
    </span>
  )

  // Payer — informational only
  if (isPayer) {
    return (
      <div className="flex items-center justify-between gap-2 py-2.5">
        <span className="flex items-center gap-2">
          {nameEl}
          <span className="text-[11px] text-ink-muted">fronted {fmtAmt(currency, split.shareAmount)}</span>
        </span>
        <span className="text-[10px] font-semibold rounded-full px-2 py-0.5 bg-success/15 text-success">✅ Payer</span>
      </div>
    )
  }

  // Fully settled — clean, with a quiet Undo
  if (settled) {
    return (
      <div className="flex items-center justify-between gap-2 py-2.5">
        <span className="flex items-center gap-2">
          {nameEl}
          <span className="text-[11px] text-success">settled · {fmtAmt(currency, split.shareAmount)}</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSetPaid(0)}
            className="text-[11px] text-ink-muted hover:text-ink underline"
          >
            Undo
          </button>
          <span className="text-[10px] font-semibold rounded-full px-2 py-0.5 bg-success/15 text-success">✅ Settled</span>
        </div>
      </div>
    )
  }

  // Owing (unpaid / partial) — progress + amount control + Mark full
  return (
    <div className="py-2.5">
      <div className="flex items-center justify-between gap-2">
        {nameEl}
        <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${pill.cls}`}>{pill.label}</span>
      </div>

      <div className="h-2 bg-line rounded-full overflow-hidden my-1.5">
        <div className={`h-full ${status === 'partial' ? 'bg-warning' : 'bg-primary'}`} style={{ width: `${pct}%` }} />
      </div>

      <div className="text-[11px] text-ink-muted mb-1.5">
        {fmtAmt(currency, split.paidAmount)} paid · <span className="text-primary font-medium">{fmtAmt(currency, left)} left</span>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-[11px] text-ink-muted shrink-0">Paid</label>
        <div className="flex items-center border border-line rounded-lg overflow-hidden bg-card flex-1 max-w-[200px] focus-within:border-primary">
          <span className="px-2.5 py-2 text-sm text-ink-muted bg-app-bg self-stretch flex items-center">
            {currency === 'JPY' ? '¥' : 'RM'}
          </span>
          <input
            type="number"
            step="0.01"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onBlur={(e) => commit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
            }}
            className="flex-1 min-w-0 px-2.5 py-2 text-sm bg-transparent"
            aria-label={`Amount ${split.participantName} has paid`}
            placeholder="0.00"
          />
        </div>
        <button
          type="button"
          onClick={() => onSetPaid(split.shareAmount)}
          className="text-xs font-semibold text-white bg-success rounded-lg px-3 py-2 shrink-0 hover:opacity-90"
        >
          Mark full
        </button>
      </div>
    </div>
  )
}

export function ExpenseItem({
  expense,
  categories,
  participants,
  defaultExpanded = false,
  onSave,
  onDelete,
  onSetSplitPaid,
}: {
  expense: Expense
  categories: Category[]
  participants: Participant[]
  defaultExpanded?: boolean
  onSave: (id: string, input: ExpenseEditInput) => Promise<{ error: string | null }>
  onDelete: (id: string) => void
  onSetSplitPaid: (expenseId: string, participantId: string, paidAmount: number, shareAmount: number) => void
}) {
  const { participant } = useAuth()
  const [expanded, setExpanded] = useState(defaultExpanded)
  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  // only the payer (the person owed reimbursement) may remove an expense
  const canDelete = !expense.seeded && participant?.name === expense.paidBy
  const [desc, setDesc] = useState(expense.desc)
  const [currency, setCurrency] = useState<Currency>(expense.currency)
  const [amount, setAmount] = useState(String(expense.amount))
  const [cat, setCat] = useState(expense.cat)
  const [notes, setNotes] = useState(expense.notes)
  const [split, setSplit] = useState<SplitValue>(() => splitFromShares(expense.splits, expense.currency))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const parsedAmount = parseFloat(amount)
  const total = isNaN(parsedAmount) ? 0 : parsedAmount

  const outstanding = expense.splits.reduce((sum, s) => sum + Math.max(0, s.shareAmount - s.paidAmount), 0)

  // show members who still owe at the top (most-owed first), then settled, then the payer
  const rank = (s: SplitShare) => {
    if (s.participantName === expense.paidBy) return 2
    return s.paidAmount >= s.shareAmount - SETTLE_EPSILON ? 1 : 0
  }
  const orderedSplits = [...expense.splits].sort((a, b) => {
    const r = rank(a) - rank(b)
    if (r !== 0) return r
    return b.shareAmount - b.paidAmount - (a.shareAmount - a.paidAmount)
  })

  function startEdit() {
    setDesc(expense.desc)
    setCurrency(expense.currency)
    setAmount(String(expense.amount))
    setCat(expense.cat)
    setNotes(expense.notes)
    setSplit(splitFromShares(expense.splits, expense.currency))
    setError(null)
    setEditing(true)
    setExpanded(true)
  }

  async function handleSave() {
    if (!desc.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a description and a valid amount.')
      return
    }
    const validity = splitValidity(split, total)
    if (!validity.valid) {
      setError(validity.message ?? 'Please fix the split before saving.')
      return
    }
    setSaving(true)
    const { error } = await onSave(expense.id, {
      desc: desc.trim(),
      amount: parsedAmount,
      currency,
      cat,
      notes: notes.trim(),
      splits: computeSplits(split, total),
    })
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
      <div className="flex flex-col gap-2 p-3 bg-app-bg rounded-lg border border-line">
        <div className="flex flex-wrap gap-2">
          <input className={`${inputClass} flex-[2] min-w-[140px]`} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Description" />
          <select className={`${inputClass} w-20`} value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
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
        <SplitEditor participants={participants} total={total} currency={currency} value={split} onChange={setSplit} />
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
    <div className="bg-card rounded-lg border border-line overflow-hidden">
      {/* Collapsed summary row — whole row toggles */}
      <button
        type="button"
        onClick={() => setExpanded((x) => !x)}
        className="w-full flex items-center gap-3 p-3 text-left"
        aria-expanded={expanded}
      >
        <span className="text-xl shrink-0">{expense.cat.trim().charAt(0)}</span>
        <span className="flex-1 min-w-0">
          <span className="flex items-center gap-2">
            <span className="font-semibold text-sm text-ink truncate">{expense.desc}</span>
            {expense.seeded && (
              <span className="shrink-0 text-[10px] text-ink-muted bg-line rounded px-1.5 py-0.5">Pre-loaded</span>
            )}
          </span>
          <span className="block text-xs text-ink-muted mt-0.5 truncate">
            Paid by {expense.paidBy} · {expense.splits.length} {expense.splits.length === 1 ? 'person' : 'people'} ·{' '}
            {outstanding > 0.001 ? (
              <span className="text-primary">{fmtAmt(expense.currency, outstanding)} owed</span>
            ) : (
              <span className="text-success">settled</span>
            )}
          </span>
        </span>
        <span className="shrink-0 text-lg font-bold text-ink whitespace-nowrap tabular-nums">
          {fmtAmt(expense.currency, expense.amount)}
        </span>
        <span className="shrink-0 text-ink-muted text-sm w-4 text-center">{expanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-line pt-2">
          <div className="text-xs text-ink-muted mb-1">{expense.cat}</div>

          {expense.splits.length > 0 && (
            <div className="divide-y divide-line">
              {orderedSplits.map((s) => (
                <SplitPaymentRow
                  key={s.participantId}
                  split={s}
                  currency={expense.currency}
                  isPayer={s.participantName === expense.paidBy}
                  isMe={s.participantId === participant?.id}
                  onSetPaid={(paid) => onSetSplitPaid(expense.id, s.participantId, paid, s.shareAmount)}
                />
              ))}
            </div>
          )}

          {expense.notes && <div className="text-xs text-ink-muted italic mt-2">{expense.notes}</div>}

          {/* action footer */}
          <div className="flex gap-2 mt-3 pt-3 border-t border-line">
            <button
              type="button"
              onClick={startEdit}
              className="text-xs font-medium text-ink-muted hover:text-ink border border-line rounded-md px-3 py-1.5"
            >
              ✏️ Edit
            </button>
            {canDelete && !confirmingDelete && (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="text-xs font-medium text-ink-muted hover:text-primary border border-line rounded-md px-3 py-1.5"
              >
                🗑️ Delete
              </button>
            )}
          </div>

          {confirmingDelete && (
            <div className="flex items-center justify-between gap-2 mt-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 flex-wrap">
              <span className="text-xs text-ink">Delete “{expense.desc}”? This can’t be undone.</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onDelete(expense.id)
                    setConfirmingDelete(false)
                  }}
                  className="bg-primary text-white text-xs font-semibold rounded-md px-3 py-1"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="border border-line text-ink-muted text-xs font-semibold rounded-md px-3 py-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
