import { useMemo, useState } from 'react'
import type { Category, Currency, Expense, Participant } from '../../types/domain'
import { categoryDisplay } from '../../lib/categoryDisplay'
import { fmtAmt } from '../../lib/format'
import type { ExpenseEditInput } from '../../hooks/useExpenses'
import { ExpenseItem } from './ExpenseItem'

function TotalRow({ currency, total }: { currency: Currency; total: number }) {
  return (
    <div className="flex justify-between items-center bg-secondary text-white rounded-lg px-4 py-3 text-sm">
      <span>Grand Total ({currency === 'JPY' ? '¥' : 'RM'})</span>
      <span className="font-bold">{fmtAmt(currency, total)}</span>
    </div>
  )
}

export function ExpenseList({
  expenses,
  categories,
  participants,
  onSave,
  onDelete,
  onSetSplitPaid,
}: {
  expenses: Expense[]
  categories: Category[]
  participants: Participant[]
  onSave: (id: string, input: ExpenseEditInput) => Promise<{ error: string | null }>
  onDelete: (id: string) => void
  onSetSplitPaid: (expenseId: string, participantId: string, paidAmount: number, shareAmount: number) => void
}) {
  const [activeCat, setActiveCat] = useState<string>('all')
  const [search, setSearch] = useState('')

  // totals & outstanding always reflect ALL expenses, not the filtered view
  const totalRM = expenses.filter((e) => e.currency === 'RM').reduce((sum, e) => sum + e.amount, 0)
  const totalJPY = expenses.filter((e) => e.currency === 'JPY').reduce((sum, e) => sum + e.amount, 0)

  const newestId = expenses[0]?.id

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return expenses.filter((e) => {
      if (activeCat !== 'all' && e.cat !== activeCat) return false
      if (q && !`${e.desc} ${e.notes} ${e.paidBy}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [expenses, activeCat, search])

  if (expenses.length === 0) {
    return <p className="text-sm text-ink-muted text-center py-6">No expenses recorded yet — add one above.</p>
  }

  const catOptions = ['all', ...categories.map((c) => categoryDisplay(c))]

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="space-y-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {catOptions.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCat(c)}
              className={`shrink-0 text-xs font-medium rounded-full px-3 py-1 border ${
                activeCat === c ? 'bg-primary text-white border-primary' : 'bg-card text-ink-muted border-line'
              }`}
            >
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search description, notes, or payer…"
          className="w-full border border-line rounded-lg px-3 py-2 text-sm bg-card"
        />
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <p className="text-sm text-ink-muted text-center py-6">No expenses match your filter.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              categories={categories}
              participants={participants}
              defaultExpanded={expense.id === newestId && activeCat === 'all' && search.trim() === ''}
              onSave={onSave}
              onDelete={onDelete}
              onSetSplitPaid={onSetSplitPaid}
            />
          ))}
        </div>
      )}

      {/* Grand totals (global, all expenses) */}
      <div className="space-y-2 pt-1">
        {totalRM > 0 && <TotalRow currency="RM" total={totalRM} />}
        {totalJPY > 0 && <TotalRow currency="JPY" total={totalJPY} />}
      </div>
    </div>
  )
}
