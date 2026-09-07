import { useParticipantsAndCategories } from '../../hooks/useParticipantsAndCategories'
import { useExpenses } from '../../hooks/useExpenses'
import { tokyoHotelSettlement, osakaHotelSettlement } from '../../data/hotelSettlement'
import { Card } from '../common/Card'
import { InfoBox } from '../common/InfoBox'
import { HotelSettlementCard } from './HotelSettlementCard'
import { ExpenseForm } from './ExpenseForm'
import { ExpenseList } from './ExpenseList'
import { BudgetTable } from './BudgetTable'

export function ExpensesTab() {
  const { participants, categories, loading: lookupsLoading } = useParticipantsAndCategories()
  const { expenses, loading: expensesLoading, addExpense, editExpense, deleteExpense } = useExpenses(participants, categories)

  const loading = lookupsLoading || expensesLoading

  return (
    <div className="space-y-4">
      <HotelSettlementCard settlement={tokyoHotelSettlement} />
      <HotelSettlementCard settlement={osakaHotelSettlement} />

      <Card title="📊 Group Expense Tracker (In-Trip)">
        <div className="space-y-2 mb-4">
          <InfoBox tone="blue">Track shared expenses during the trip. Enter who paid and split evenly.</InfoBox>
          <InfoBox tone="blue">
            <span>
              ☁️ <strong>Cloud synced &amp; live:</strong> Expenses update instantly for everyone — no refresh needed.
            </span>
          </InfoBox>
        </div>

        {loading ? (
          <p className="text-sm text-ink-muted text-center py-6">Loading expenses…</p>
        ) : (
          <>
            <ExpenseForm participants={participants} categories={categories} onAdd={addExpense} />
            <div className="mt-4">
              <ExpenseList
                expenses={expenses}
                categories={categories}
                participantCount={participants.length}
                onSave={editExpense}
                onDelete={deleteExpense}
              />
            </div>
          </>
        )}
      </Card>

      <Card title="📈 Estimated Per-Person Budget">
        <BudgetTable />
      </Card>
    </div>
  )
}
