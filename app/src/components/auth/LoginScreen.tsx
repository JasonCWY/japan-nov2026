import { useState } from 'react'
import { members } from '../../data/members'
import { useAuth } from '../../hooks/useAuth'
import { TRIP_ACCESS_KEY } from '../../lib/auth'

export function LoginScreen() {
  const { signIn } = useAuth()
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function pick(name: string) {
    setBusy(name)
    setError(null)
    const { error } = await signIn(name, TRIP_ACCESS_KEY)
    if (error) {
      setError(error)
      setBusy(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🇯🇵</div>
          <h1 className="font-bold text-lg text-ink">Nov 2026 Japan Trip</h1>
          <p className="text-sm text-ink-muted">Tap your name to continue</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {members.map((m) => (
            <button
              key={m.name}
              type="button"
              onClick={() => pick(m.name)}
              disabled={!!busy}
              className="bg-card rounded-[var(--radius-card)] shadow-[var(--shadow-card)] dark:border dark:border-line p-4 flex flex-col items-center gap-2 disabled:opacity-50 active:scale-[0.98] transition-transform"
            >
              <span
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                style={{ background: m.color }}
              >
                {m.initials}
              </span>
              <span className="text-sm font-medium text-ink">{busy === m.name ? 'Signing in…' : m.name}</span>
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-primary text-center mt-4">{error}</p>}
      </div>
    </div>
  )
}
