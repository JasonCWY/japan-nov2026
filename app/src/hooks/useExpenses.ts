import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { categoryDisplay } from '../lib/categoryDisplay'
import type { Category, Currency, Expense, Participant, SplitShare } from '../types/domain'

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

interface SplitRow {
  expense_id: string
  participant_id: string
  share_amount: string | number
  paid_amount: string | number
  is_settled: boolean
}

const SETTLE_EPSILON = 0.005

function num(v: string | number): number {
  return typeof v === 'string' ? parseFloat(v) : v
}

export interface ExpenseInput {
  desc: string
  amount: number
  currency: Currency
  paidBy: string
  cat: string
  notes: string
  splits: { participantId: string; shareAmount: number }[]
}

export interface ExpenseEditInput {
  desc: string
  amount: number
  currency: Currency
  cat: string
  notes: string
  splits: { participantId: string; shareAmount: number }[]
}

export function useExpenses(participants: Participant[], categories: Category[]) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  const toExpense = useCallback(
    (row: ExpenseRow, splitsByExpense: Map<string, SplitShare[]>): Expense => ({
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
      splits: splitsByExpense.get(row.id) ?? [],
    }),
    [participants, categories]
  )

  const load = useCallback(async () => {
    // newest first — freshly added expenses surface at the top of the list
    const [expRes, splitRes] = await Promise.all([
      supabase.from('expenses').select('*').order('created_at', { ascending: false }),
      supabase.from('expense_splits').select('*'),
    ])
    if (expRes.error || !expRes.data) {
      setLoading(false)
      return
    }

    const splitsByExpense = new Map<string, SplitShare[]>()
    for (const raw of (splitRes.data ?? []) as SplitRow[]) {
      const list = splitsByExpense.get(raw.expense_id) ?? []
      list.push({
        participantId: raw.participant_id,
        participantName: participants.find((p) => p.id === raw.participant_id)?.name ?? raw.participant_id,
        shareAmount: num(raw.share_amount),
        paidAmount: num(raw.paid_amount),
        isSettled: raw.is_settled,
      })
      splitsByExpense.set(raw.expense_id, list)
    }

    // keep each expense's splits in a stable participant order for display
    const order = new Map(participants.map((p, i) => [p.id, i]))
    for (const list of splitsByExpense.values()) {
      list.sort((a, b) => (order.get(a.participantId) ?? 0) - (order.get(b.participantId) ?? 0))
    }

    setExpenses(expRes.data.map((row) => toExpense(row, splitsByExpense)))
    setLoading(false)
  }, [toExpense, participants])

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
    if (input.splits.length === 0) return { error: 'Select at least one person to split between.' }

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

    // one row per *involved* person; the payer's own share is already fully paid
    const rows = input.splits.map((s) => {
      const isPayer = s.participantId === payer.id
      return {
        expense_id: expRow.id,
        participant_id: s.participantId,
        share_amount: s.shareAmount,
        paid_amount: isPayer ? s.shareAmount : 0,
        is_settled: isPayer,
      }
    })
    const { error: splitErr } = await supabase.from('expense_splits').insert(rows)
    if (splitErr) console.error('Split insert failed:', splitErr.message)

    await load()
    return { error: null }
  }

  async function editExpense(id: string, input: ExpenseEditInput): Promise<{ error: string | null }> {
    const category = categories.find((c) => categoryDisplay(c) === input.cat)
    if (!category) return { error: 'Invalid category.' }
    if (input.splits.length === 0) return { error: 'Select at least one person to split between.' }

    const existing = expenses.find((e) => e.id === id)
    const payer = participants.find((p) => p.name === existing?.paidBy)

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

    // replace the split set entirely so involved-people and amounts stay consistent with the edit,
    // carrying over each person's prior paid amount where they're still involved (clamped to new share)
    const priorPaid = new Map((existing?.splits ?? []).map((s) => [s.participantId, s.paidAmount]))
    await supabase.from('expense_splits').delete().eq('expense_id', id)
    const rows = input.splits.map((s) => {
      const isPayer = payer ? s.participantId === payer.id : false
      const paid = isPayer ? s.shareAmount : Math.min(priorPaid.get(s.participantId) ?? 0, s.shareAmount)
      return {
        expense_id: id,
        participant_id: s.participantId,
        share_amount: s.shareAmount,
        paid_amount: paid,
        is_settled: paid >= s.shareAmount - SETTLE_EPSILON,
      }
    })
    const { error: splitErr } = await supabase.from('expense_splits').insert(rows)
    if (splitErr) console.error('Split rewrite failed:', splitErr.message)

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

  async function setSplitPaid(expenseId: string, participantId: string, paidAmount: number, shareAmount: number) {
    const clamped = Math.max(0, Math.min(paidAmount, shareAmount))
    const { error } = await supabase
      .from('expense_splits')
      .update({ paid_amount: clamped, is_settled: clamped >= shareAmount - SETTLE_EPSILON })
      .eq('expense_id', expenseId)
      .eq('participant_id', participantId)
    if (error) console.error('Set paid failed:', error.message)
    await load()
  }

  return { expenses, loading, addExpense, editExpense, deleteExpense, setSplitPaid }
}
