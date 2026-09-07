import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { ChecklistItem, ChecklistPriority } from '../types/domain'

interface ChecklistRow {
  id: string
  priority: ChecklistPriority
  sort_order: number
  label: string
  is_done: boolean
  done_by: string | null
  updated_at: string
}

function toItem(row: ChecklistRow): ChecklistItem {
  return {
    id: row.id,
    priority: row.priority,
    sortOrder: row.sort_order,
    label: row.label,
    isDone: row.is_done,
    doneBy: row.done_by,
    updatedAt: row.updated_at,
  }
}

export function useChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('checklist_items').select('*').order('sort_order', { ascending: true })
    if (!error && data) setItems(data.map(toItem))
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const channel = supabase
      .channel('checklist-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'checklist_items' }, () => load())
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [load])

  async function toggleItem(id: string, isDone: boolean, participantId: string | undefined) {
    const { error } = await supabase
      .from('checklist_items')
      .update({ is_done: isDone, done_by: isDone ? participantId ?? null : null, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) console.error('Checklist update failed:', error.message)
    await load()
  }

  return { items, loading, toggleItem }
}
