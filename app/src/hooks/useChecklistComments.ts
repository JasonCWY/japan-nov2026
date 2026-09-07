import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { ChecklistComment, Participant } from '../types/domain'

interface CommentRow {
  id: string
  item_id: string
  participant_id: string | null
  body: string
  created_at: string
}

export function useChecklistComments(participants: Participant[]) {
  const [byItem, setByItem] = useState<Map<string, ChecklistComment[]>>(new Map())

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('checklist_comments')
      .select('*')
      .order('created_at', { ascending: true })
    if (error || !data) return

    const map = new Map<string, ChecklistComment[]>()
    for (const r of data as CommentRow[]) {
      const list = map.get(r.item_id) ?? []
      list.push({
        id: r.id,
        itemId: r.item_id,
        participantId: r.participant_id,
        authorName: participants.find((p) => p.id === r.participant_id)?.name ?? 'Someone',
        body: r.body,
        createdAt: r.created_at,
      })
      map.set(r.item_id, list)
    }
    setByItem(map)
  }, [participants])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const channel = supabase
      .channel('checklist-comments-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'checklist_comments' }, () => load())
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [load])

  async function addComment(itemId: string, body: string, participantId: string | undefined) {
    const trimmed = body.trim()
    if (!trimmed) return
    const { error } = await supabase
      .from('checklist_comments')
      .insert({ item_id: itemId, participant_id: participantId ?? null, body: trimmed })
    if (error) console.error('Add comment failed:', error.message)
    await load()
  }

  async function deleteComment(id: string) {
    const { error } = await supabase.from('checklist_comments').delete().eq('id', id)
    if (error) console.error('Delete comment failed:', error.message)
    await load()
  }

  return { byItem, addComment, deleteComment }
}
