import type { Category, Currency, Expense } from '../../types/domain'
import { fmtAmt, fmtPer } from '../../lib/format'
import { ExpenseItem } from './ExpenseItem'

function TotalRow({ currency, total, participantCount }: { currency: Currency; total: number; participantCount: number }) {
  return (
    <div className="flex justify-between items-center bg-secondary text-white rounded-lg px-4 py-3 text-sm">
      <span>Total ({currency === 'JPY' ? '¥' : 'RM'})</span>
      <span className="font-bold">
        {fmtAmt(currency, total)} <span className="font-normal text-white/60">· {fmtPer(currency, total, participantCount)} each</span>
      </span>
    </div>
  )
}

export function ExpenseList({
  expenses,
  categories,
  participantCount,
  onSave,
  onDelete,
}: {
  expenses: Expense[]
  categories: Category[]
  participantCount: number
  onSave: (id: string, input: { desc: string; amount: number; currency: Currency; cat: string; notes: string }) => Promise<{ error: string | null }>
  onDelete: (id: string) => void
}) {
  if (expenses.length === 0) {
    return <p className="text-sm text-ink-muted text-center py-6">No expenses recorded yet.</p>
  }

  const totalRM = expenses.filter((e) => e.currency === 'RM').reduce((sum, e) => sum + e.amount, 0)
  const totalJPY = expenses.filter((e) => e.currency === 'JPY').reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="space-y-1">
      <div className="divide-y divide-line">
        {expenses.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            categories={categories}
            participantCount={participantCount}
            onSave={onSave}
            onDelete={onDelete}
          />
        ))}
      </div>
      <div className="space-y-2 pt-2">
        {totalRM > 0 && <TotalRow currency="RM" total={totalRM} participantCount={participantCount} />}
        {totalJPY > 0 && <TotalRow currency="JPY" total={totalJPY} participantCount={participantCount} />}
      </div>
    </div>
  )
}
