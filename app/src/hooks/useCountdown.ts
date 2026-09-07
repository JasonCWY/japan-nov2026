import { useEffect, useState } from 'react'

const DEPARTURE = new Date('2026-11-07T09:20:00+08:00').getTime()

export interface Countdown {
  departed: boolean
  days: string
  hours: string
  mins: string
  secs: string
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function computeCountdown(): Countdown {
  const diff = DEPARTURE - Date.now()
  if (diff <= 0) {
    return { departed: true, days: '00', hours: '00', mins: '00', secs: '00' }
  }
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  return { departed: false, days: pad(days), hours: pad(hours), mins: pad(mins), secs: pad(secs) }
}

export function useCountdown(): Countdown {
  const [countdown, setCountdown] = useState<Countdown>(computeCountdown)

  useEffect(() => {
    const id = setInterval(() => setCountdown(computeCountdown()), 1000)
    return () => clearInterval(id)
  }, [])

  return countdown
}
