/**
 * A minimal, fully-serializable representation of an authenticated user.
 *
 * The `User` object from `@netlify/identity` carries `unknown`-typed metadata
 * that TanStack Start refuses to serialize across the server/client boundary,
 * so on the server we normalize it down to just the fields the app needs.
 */
export interface AuthUser {
  id: string
  email: string | null
  name: string | null
  roles: string[]
}

/**
 * Local-development auth shim.
 *
 * Netlify Identity cannot authenticate on localhost — the `nf_jwt` cookie is
 * only set by a real Netlify deployment (see the tanstack-start-identity skill).
 * To keep the account area exercisable locally, the server and client fall back
 * to this stable mock user when no real Identity user is present AND we are not
 * running in production.
 *
 * In production this is never used: `getCurrentUser()` (server) only falls back
 * when `process.env.NODE_ENV !== 'production'`, and the client only falls back
 * when `import.meta.env.DEV` is true.
 */
export const DEV_USER: AuthUser = {
  id: 'local-dev-user',
  email: 'dev@local.test',
  name: 'Local Dev',
  roles: ['user'],
}
