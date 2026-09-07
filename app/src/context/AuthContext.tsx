import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import { buildTripEmail } from '../lib/auth'
import type { Participant } from '../types/domain'

export interface AuthContextValue {
  session: Session | null
  participant: Participant | null
  loading: boolean
  signIn: (name: string, pin: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  changePin: (newPin: string) => Promise<{ error: string | null }>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [participant, setParticipant] = useState<Participant | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) {
      setParticipant(null)
      return
    }
    let cancelled = false
    supabase
      .from('participants')
      .select('id, name, auth_user_id')
      .eq('auth_user_id', session.user.id)
      .single()
      .then(({ data }) => {
        if (!cancelled && data) {
          setParticipant({ id: data.id, name: data.name, authUserId: data.auth_user_id })
        }
      })
    return () => {
      cancelled = true
    }
  }, [session])

  async function signIn(name: string, pin: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email: buildTripEmail(name),
      password: pin,
    })
    return { error: error ? 'Wrong name or PIN — try again.' : null }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function changePin(newPin: string) {
    const { error } = await supabase.auth.updateUser({ password: newPin })
    return { error: error ? error.message : null }
  }

  return (
    <AuthContext.Provider value={{ session, participant, loading, signIn, signOut, changePin }}>
      {children}
    </AuthContext.Provider>
  )
}
