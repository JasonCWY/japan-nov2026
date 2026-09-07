export function slugifyName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '')
}

export function buildTripEmail(name: string): string {
  return `${slugifyName(name)}@trip.local`
}

// Shared access key so login is just "pick your name". All 6 trip accounts share
// this password; the app signs in with it behind the scenes. It is NOT a real
// secret — it ships in the client bundle. Supplied via env (kept out of the public
// repo); access control is effectively "you have the private link", with RLS still
// limiting every request to this app's tables.
export const TRIP_ACCESS_KEY = import.meta.env.VITE_TRIP_ACCESS_KEY as string
