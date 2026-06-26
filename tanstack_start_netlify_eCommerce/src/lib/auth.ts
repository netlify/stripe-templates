import { createServerFn } from '@tanstack/react-start'
import type { AuthUser } from '@/lib/dev-user'
import { getCurrentUser } from '@/server/current-user'

export type { AuthUser }

/**
 * Server function that returns the current user (or `null`).
 * Safe to call from route `beforeLoad` guards and loaders.
 */
export const getServerUser = createServerFn({ method: 'GET' }).handler(
  async (): Promise<AuthUser | null> => {
    return await getCurrentUser()
  },
)
