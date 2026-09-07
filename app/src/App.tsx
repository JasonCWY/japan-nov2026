import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import { LoginScreen } from './components/auth/LoginScreen'
import { Hero } from './components/layout/Hero'
import { UserBar } from './components/layout/UserBar'
import { TabNav } from './components/layout/TabNav'
import { OverviewTab } from './components/overview/OverviewTab'
import { ItineraryTab } from './components/itinerary/ItineraryTab'
import { HalalGuideTab } from './components/halal/HalalGuideTab'
import { ExpensesTab } from './components/expenses/ExpensesTab'
import { ChecklistTab } from './components/checklist/ChecklistTab'
import type { TabId } from './types/domain'

function AppShell() {
  const { session, loading } = useAuth()
  const [tab, setTab] = useState<TabId>('overview')

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-ink-muted text-sm">Loading…</div>
  }

  if (!session) {
    return <LoginScreen />
  }

  return (
    <div className="min-h-screen">
      <Hero />
      <UserBar />
      <TabNav active={tab} onChange={setTab} />
      <main className="mx-auto max-w-4xl px-4 py-6 space-y-4">
        <div className={tab === 'overview' ? '' : 'hidden'}>
          <OverviewTab />
        </div>
        <div className={tab === 'itinerary' ? '' : 'hidden'}>
          <ItineraryTab />
        </div>
        <div className={tab === 'expenses' ? '' : 'hidden'}>
          <ExpensesTab />
        </div>
        <div className={tab === 'checklist' ? '' : 'hidden'}>
          <ChecklistTab />
        </div>
        <div className={tab === 'halal' ? '' : 'hidden'}>
          <HalalGuideTab />
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}

export default App
