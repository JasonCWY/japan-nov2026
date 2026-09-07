import { useState } from 'react'
import { useParticipantsAndCategories } from '../../hooks/useParticipantsAndCategories'
import { useExpenses, type ExpenseInput } from '../../hooks/useExpenses'
import { Card } from '../common/Card'
import { CollapsibleCard } from '../common/CollapsibleCard'
import { InfoBox } from '../common/InfoBox'
import { PersonalBalance } from './PersonalBalance'
import { SettleUp } from './SettleUp'
import { ExpenseForm } from './ExpenseForm'
import { ExpenseList } from './ExpenseList'
import { ExpenseListSkeleton } from './ExpenseListSkeleton'
import { BudgetTable } from './BudgetTable'

export function ExpensesTab() {
  const { participants, categories, loading: lookupsLoading } = useParticipantsAndCategories()
  const { expenses, loading: expensesLoading, addExpense, editExpense, deleteExpense, setSplitPaid } = useExpenses(
    participants,
    categories
  )
  const [showForm, setShowForm] = useState(false)

  const loading = lookupsLoading || expensesLoading

  async function handleAdd(input: ExpenseInput) {
    const res = await addExpense(input)
    if (!res.error) setShowForm(false)
    return res
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card title="📊 Group Expense Tracker (In-Trip)">
          <ExpenseListSkeleton />
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Your balance at a glance */}
      <PersonalBalance expenses={expenses} participants={participants} />

      {/* The tracker */}
      <Card title="📊 Group Expense Tracker (In-Trip)">
        <InfoBox tone="blue">
          <span>
            ☁️ <strong>Live &amp; shared:</strong> expenses, payments and who's settled update instantly for everyone.
          </span>
        </InfoBox>

        <div className="mt-4 space-y-4">
          {showForm ? (
            <div className="space-y-2">
              <ExpenseForm participants={participants} categories={categories} onAdd={handleAdd} />
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xs text-ink-muted hover:text-ink underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="w-full bg-primary text-white font-semibold rounded-lg py-2.5 text-sm"
            >
              + Add Expense
            </button>
          )}

          <ExpenseList
            expenses={expenses}
            categories={categories}
            participants={participants}
            onSave={editExpense}
            onDelete={deleteExpense}
            onSetSplitPaid={setSplitPaid}
          />
        </div>
      </Card>

      {/* Who pays whom */}
      <SettleUp expenses={expenses} participants={participants} />

      {/* Budget estimate — collapsed */}
      <CollapsibleCard title="📈 Estimated Per-Person Budget" subtitle="Rough per-person cost estimate">
        <BudgetTable />
      </CollapsibleCard>
    </div>
  )
}
