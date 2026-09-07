import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { categoryDisplay } from '../lib/categoryDisplay'
import type { Category, Currency, Expense, Participant } from '../types/domain'

interface ExpenseRow {
  id: string
  description: string
  amount: string | number
  currency: string
  paid_by_id: string
  category_id: number
  notes: string | null
  is_seeded: boolean | null
}

export interface ExpenseInput {
  desc: string
  amount: number
  currency: Currency
  paidBy: string
  cat: string
  notes: string
}

export function useExpenses(participants: Participant[], categories: Category[]) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  const toExpense = useCallback(
    (row: ExpenseRow): Expense => ({
      id: row.id,
      desc: row.description,
      amount: typeof row.amount === 'string' ? parseFloat(row.amount) : row.amount,
      currency: row.currency === 'JPY' ? 'JPY' : 'RM',
      paidBy: participants.find((p) => p.id === row.paid_by_id)?.name ?? row.paid_by_id,
      cat: (() => {
        const cat = categories.find((c) => c.id === row.category_id)
        return cat ? categoryDisplay(cat) : ''
      })(),
      notes: row.notes ?? '',
      seeded: row.is_seeded ?? false,
    }),
    [participants, categories]
  )

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('expenses').select('*').order('created_at', { ascending: true })
    if (!error && data) setExpenses(data.map(toExpense))
    setLoading(false)
  }, [toExpense])

  const ready = participants.length > 0 && categories.length > 0

  useEffect(() => {
    if (ready) load()
  }, [ready, load])

  useEffect(() => {
    if (!ready) return
    const channel = supabase
      .channel('expenses-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expense_splits' }, () => load())
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [ready, load])

  async function addExpense(input: ExpenseInput): Promise<{ error: string | null }> {
    const payer = participants.find((p) => p.name === input.paidBy)
    const category = categories.find((c) => categoryDisplay(c) === input.cat)
    if (!payer || !category) return { error: 'Invalid participant or category.' }

    const { data: expRow, error: expErr } = await supabase
      .from('expenses')
      .insert({
        description: input.desc,
        amount: input.amount,
        currency: input.currency,
        paid_by_id: payer.id,
        category_id: category.id,
        notes: input.notes || null,
      })
      .select()
      .single()

    if (expErr || !expRow) return { error: expErr?.message ?? 'Failed to save expense.' }

    // split evenly across the actual current participant count, not a hardcoded number
    const shareAmount = input.amount / participants.length
    const splits = participants.map((p) => ({
      expense_id: expRow.id,
      participant_id: p.id,
      share_amount: shareAmount,
      is_settled: p.id === payer.id,
    }))
    const { error: splitErr } = await supabase.from('expense_splits').insert(splits)
    if (splitErr) console.error('Split insert failed:', splitErr.message)

    await load()
    return { error: null }
  }

  async function editExpense(
    id: string,
    input: { desc: string; amount: number; currency: Currency; cat: string; notes: string }
  ): Promise<{ error: string | null }> {
    const category = categories.find((c) => categoryDisplay(c) === input.cat)
    if (!category) return { error: 'Invalid category.' }

    const { error: updErr } = await supabase
      .from('expenses')
      .update({
        description: input.desc,
        amount: input.amount,
        currency: input.currency,
        category_id: category.id,
        notes: input.notes || null,
      })
      .eq('id', id)

    if (updErr) return { error: updErr.message }

    // recompute each participant's share so it stays consistent with the edited amount
    const shareAmount = input.amount / participants.length
    const { error: splitErr } = await supabase
      .from('expense_splits')
      .update({ share_amount: shareAmount })
      .eq('expense_id', id)
    if (splitErr) console.error('Split recompute failed:', splitErr.message)

    await load()
    return { error: null }
  }

  async function deleteExpense(id: string) {
    const expense = expenses.find((e) => e.id === id)
    if (!expense || expense.seeded) return
    await supabase.from('expense_splits').delete().eq('expense_id', id)
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (error) console.error('Delete failed:', error.message)
    await load()
  }

  return { expenses, loading, addExpense, editExpense, deleteExpense }
}
