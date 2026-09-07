import { useAuth } from '../../hooks/useAuth'

export function UserBar() {
  const { participant, signOut } = useAuth()

  return (
    <div className="bg-secondary text-white/80 text-xs px-4 py-1.5 flex justify-center items-center gap-3">
      <span>Signed in as {participant?.name ?? '…'}</span>
      <button type="button" onClick={signOut} className="underline hover:text-white">
        Sign out
      </button>
    </div>
  )
}
