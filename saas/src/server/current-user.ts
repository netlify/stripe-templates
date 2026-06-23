// Server-only helper. NEVER import this from client code.
import { getUser } from '@netlify/identity'
import { DEV_USER, type AuthUser } from '@/lib/dev-user'

/**
 * Resolve the authenticated user on the server, normalized to {@link AuthUser}.
 *
 * `@netlify/identity`'s `getUser()` reads and validates the `nf_jwt` cookie.
 * It never throws — it returns `null` when there is no valid session (including
 * locally, where Identity is not available).
 *
 * In local development we fall back to {@link DEV_USER} so the app is fully
 * usable with `netlify dev` (where Identity has no backend). In a production
 * build we return `null` and callers (middleware / route guards) reject the
 * request. `import.meta.env.DEV` is statically replaced by Vite at build time,
 * so this branch is compiled out of production bundles.
 */
// True when running locally: either Vite's dev server (`import.meta.env.DEV`,
// compiled out of production bundles) or under `netlify dev`, which injects
// `NETLIFY_DEV=true` at runtime even when serving a production-mode build.
// On a real Netlify deploy both are false, so the shim is never active there.
const IS_LOCAL_DEV =
  import.meta.env.DEV || process.env.NETLIFY_DEV === 'true'

export async function getCurrentUser(): Promise<AuthUser | null> {
  const user = await getUser()
  if (user) {
    return {
      id: user.id,
      email: user.email ?? null,
      name: user.name ?? null,
      roles: user.roles ?? [],
    }
  }
  if (IS_LOCAL_DEV) return DEV_USER
  return null
}
