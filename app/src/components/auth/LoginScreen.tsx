import { useState, type FormEvent } from 'react'
import { members } from '../../data/members'
import { useAuth } from '../../hooks/useAuth'

export function LoginScreen() {
  const { signIn } = useAuth()
  const [name, setName] = useState(members[0].name)
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await signIn(name, pin)
    if (error) setError(error)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-6 w-full max-w-sm space-y-4"
      >
        <div className="text-center">
          <div className="text-3xl mb-1">🇯🇵</div>
          <h1 className="font-bold text-lg text-ink">Japan Trip Dashboard</h1>
          <p className="text-sm text-ink-muted">Sign in to continue</p>
        </div>

        <div>
          <label htmlFor="login-name" className="block text-sm font-medium text-ink mb-1">
            Who are you?
          </label>
          <select
            id="login-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-line rounded-lg px-3 py-2 text-sm bg-card"
          >
            {members.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="login-pin" className="block text-sm font-medium text-ink mb-1">
            PIN
          </label>
          <input
            id="login-pin"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full border border-line rounded-lg px-3 py-2 text-sm"
            placeholder="Enter the group PIN"
            required
          />
        </div>

        {error && <p className="text-sm text-primary">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-white font-semibold rounded-lg py-2 text-sm disabled:opacity-50"
        >
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
