import type { TabId } from '../types/domain'

export type Accent = 'info' | 'purple' | 'success' | 'warning' | 'gold'

export interface SectionMeta {
  id: TabId
  label: string
  icon: string
  subtitle: string
  accent: Accent
  primary: boolean // shown in the top strip / bottom nav (Overview lives in the drawer only)
}

export const SECTIONS: SectionMeta[] = [
  { id: 'overview', label: 'Trip Overview', icon: '🧭', subtitle: 'Group, flights & stays', accent: 'info', primary: false },
  { id: 'itinerary', label: 'Itinerary', icon: '🗺️', subtitle: 'Day-by-day plan', accent: 'purple', primary: true },
  { id: 'expenses', label: 'Expenses', icon: '💰', subtitle: 'Shared costs & who owes what', accent: 'success', primary: true },
  { id: 'checklist', label: 'Checklist', icon: '✅', subtitle: 'Trip prep tasks', accent: 'warning', primary: true },
  { id: 'halal', label: 'Halal Guide', icon: '🕌', subtitle: 'Halal food & prayer', accent: 'gold', primary: true },
]

export const PRIMARY_SECTIONS = SECTIONS.filter((s) => s.primary)

export function sectionById(id: TabId): SectionMeta {
  return SECTIONS.find((s) => s.id === id) ?? SECTIONS[0]
}

export const accentChip: Record<Accent, string> = {
  info: 'bg-info/15 text-info',
  purple: 'bg-purple/15 text-purple',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  gold: 'bg-gold/20 text-gold',
}

export const accentText: Record<Accent, string> = {
  info: 'text-info',
  purple: 'text-purple',
  success: 'text-success',
  warning: 'text-warning',
  gold: 'text-gold',
}
