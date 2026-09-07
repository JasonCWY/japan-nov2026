export function slugifyName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '')
}

export function buildTripEmail(name: string): string {
  return `${slugifyName(name)}@trip.local`
}
