import { useState, type FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'

export function ChangePinModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { changePin } = useAuth()
  const [pin, setPin] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'saving' | 'done'>('idle')

  if (!open) return null

  function close() {
    setPin('')
    setConfirm('')
    setError(null)
    setStatus('idle')
    onClose()
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (pin.length < 6) {
      setError('PIN must be at least 6 characters.')
      return
    }
    if (pin !== confirm) {
      setError('The two PINs don’t match.')
      return
    }
    setStatus('saving')
    const { error } = await changePin(pin)
    if (error) {
      setError(error)
      setStatus('idle')
      return
    }
    setStatus('done')
  }

  const inputClass = 'w-full border border-line rounded-lg px-3 py-2 text-sm bg-card'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={close} aria-hidden="true" />
      <form onSubmit={submit} className="relative bg-card rounded-[var(--radius-card)] shadow-2xl w-full max-w-sm p-5 space-y-3">
        <h3 className="font-bold text-ink">🔑 Change PIN</h3>
        <p className="text-xs text-ink-muted">
          Sets the sign-in PIN for <strong>your</strong> account. At least 6 characters.
        </p>

        {status === 'done' ? (
          <div className="text-sm text-success">✅ PIN updated — use it next time you sign in on any device.</div>
        ) : (
          <>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="New PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className={inputClass}
            />
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Confirm new PIN"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputClass}
            />
            {error && <p className="text-sm text-primary">{error}</p>}
          </>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={close}
            className="border border-line text-ink-muted text-sm font-medium rounded-lg px-3 py-1.5"
          >
            {status === 'done' ? 'Close' : 'Cancel'}
          </button>
          {status !== 'done' && (
            <button
              type="submit"
              disabled={status === 'saving'}
              className="bg-primary text-white text-sm font-semibold rounded-lg px-3 py-1.5 disabled:opacity-50"
            >
              {status === 'saving' ? 'Saving…' : 'Update PIN'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
