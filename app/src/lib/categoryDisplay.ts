import type { Category } from '../types/domain'

export function categoryDisplay(cat: Category): string {
  return `${cat.icon.trim()} ${cat.name}`
}
