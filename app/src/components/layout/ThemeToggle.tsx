import { useState } from 'react'

export function ThemeToggle({ withLabel = false, onDark = false }: { withLabel?: boolean; onDark?: boolean }) {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light')
    } catch {
      /* ignore storage errors */
    }
  }

  if (onDark) {
    return (
      <button
        type="button"
        onClick={toggle}
        className="shrink-0 text-white/80 hover:text-white transition-colors text-lg leading-none"
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={dark ? 'Light mode' : 'Dark mode'}
      >
        {dark ? '☀️' : '🌙'}
      </button>
    )
  }

  if (withLabel) {
    return (
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors"
      >
        <span>{dark ? '☀️' : '🌙'}</span>
        <span>{dark ? 'Light mode' : 'Dark mode'}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="shrink-0 text-ink-muted hover:text-ink transition-colors text-lg leading-none"
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
