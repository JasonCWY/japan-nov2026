import { useEffect, useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import { LoginScreen } from './components/auth/LoginScreen'
import { AppHeader } from './components/layout/AppHeader'
import { Drawer } from './components/layout/Drawer'
import { SectionHeader } from './components/layout/SectionHeader'
import { OverviewTab } from './components/overview/OverviewTab'
import { ItineraryTab } from './components/itinerary/ItineraryTab'
import { HalalGuideTab } from './components/halal/HalalGuideTab'
import { ExpensesTab } from './components/expenses/ExpensesTab'
import { ChecklistTab } from './components/checklist/ChecklistTab'
import type { TabId } from './types/domain'

function AppShell() {
  const { session, loading } = useAuth()
  const [tab, setTab] = useState<TabId>('overview')
  const [drawerOpen, setDrawerOpen] = useState(false)

  // open each section at the top, like a native app
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [tab])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-ink-muted text-sm">Loading…</div>
  }

  if (!session) {
    return <LoginScreen />
  }

  return (
    <div className="min-h-screen">
      <AppHeader onMenu={() => setDrawerOpen(true)} />
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        active={tab}
        onNavigate={(t) => {
          setTab(t)
          setDrawerOpen(false)
        }}
      />

      <main className="mx-auto max-w-4xl px-4 pt-5 pb-12">
        <div key={tab} className="mb-5 animate-section">
          <SectionHeader section={tab} />
        </div>

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
