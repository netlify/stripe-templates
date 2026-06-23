import { createMiddleware } from '@tanstack/react-start'
import { getCurrentUser } from '@/server/current-user'

/**
 * Middleware that requires authentication. Injects the resolved Netlify Identity
 * user into the server-function context as `context.user`. Throws if there is no
 * authenticated user (and, in production, no dev fallback).
 */
export const requireAuthMiddleware = createMiddleware().server(
  async ({ next }) => {
    const user = await getCurrentUser()
    if (!user) throw new Error('Authentication required')
    return next({ context: { user } })
  },
)
