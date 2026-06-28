import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

/** Returns the current session user, or null. */
export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

/**
 * Resolve the current user id from the Better Auth session.
 * Every server action / query that touches user data MUST go through this —
 * it is the only thing standing between one user and another's rows.
 */
export async function getUserId(): Promise<string> {
  const user = await getSessionUser()
  if (!user) throw new Error('Unauthorized')
  return user.id
}
