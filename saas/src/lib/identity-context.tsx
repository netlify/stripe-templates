import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  getUser,
  logout as nlLogout,
  onAuthChange,
  type User,
} from '@netlify/identity'
import { DEV_USER, type AuthUser } from './dev-user'

// In local dev, Netlify Identity has no backend, so fall back to a mock user so
// the UI reflects a signed-in state. Never active in a production build.
const DEV = import.meta.env.DEV

function toAuthUser(u: User | null): AuthUser | null {
  if (!u) return DEV ? DEV_USER : null
  return {
    id: u.id,
    email: u.email ?? null,
    name: u.name ?? null,
    roles: u.roles ?? [],
  }
}

interface IdentityContextValue {
  user: AuthUser | null
  ready: boolean
  logout: () => Promise<void>
}

const IdentityContext = createContext<IdentityContextValue | null>(null)

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    getUser().then((u) => {
      setUser(toAuthUser(u))
      setReady(true)
    })

    // onAuthChange fires with (event, user) on login/logout/token refresh.
    const unsubscribe = onAuthChange((_event, u) => {
      setUser(toAuthUser(u))
    })

    return unsubscribe
  }, [])

  const logout = async () => {
    try {
      await nlLogout()
    } catch {
      // logout() can throw locally where there is no Identity backend; ignore.
    }
    if (!DEV) setUser(null)
  }

  return (
    <IdentityContext.Provider value={{ user, ready, logout }}>
      {children}
    </IdentityContext.Provider>
  )
}

export function useIdentity() {
  const ctx = useContext(IdentityContext)
  if (!ctx) {
    throw new Error('useIdentity must be used within an IdentityProvider')
  }
  return ctx
}
