import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Participant, Category } from '../types/domain'

export function useParticipantsAndCategories() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      supabase.from('participants').select('id, name, auth_user_id').order('name'),
      supabase.from('categories').select('id, icon, name').order('id'),
    ]).then(([participantsRes, categoriesRes]) => {
      if (cancelled) return
      if (participantsRes.data) {
        setParticipants(
          participantsRes.data.map((row) => ({ id: row.id, name: row.name, authUserId: row.auth_user_id }))
        )
      }
      if (categoriesRes.data) setCategories(categoriesRes.data)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { participants, categories, loading }
}
