import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { login, signup, oauthLogin, AuthError } from '@netlify/identity'
import { useIdentity } from '@/lib/identity-context'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

type Mode = 'login' | 'signup'

function LoginPage() {
  const { user, ready } = useIdentity()
  const navigate = useNavigate()

  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  if (!ready) {
    return <Centered>Loading…</Centered>
  }

  // Already signed in (includes the local dev user) — go to the app.
  if (user) {
    navigate({ to: '/app' })
    return null
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')
    try {
      if (mode === 'login') {
        await login(email, password)
        navigate({ to: '/app' })
      } else {
        await signup(email, password, { full_name: name })
        // With autoconfirm off (the default), the user must confirm via email
        // before logging in. Do not redirect — show a confirmation prompt.
        setNotice(
          `Confirmation email sent to ${email}. Click the link in it to finish signing up.`,
        )
        setMode('login')
      }
    } catch (err) {
      setError(
        err instanceof AuthError
          ? err.message
          : 'Something went wrong. Please try again.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <Centered>
      <div className="w-full max-w-sm rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold mb-1">
          {mode === 'login' ? 'Sign in' : 'Create an account'}
        </h1>
        <p className="text-sm text-gray-500 mb-5">
          {mode === 'login'
            ? 'Sign in to manage your todos.'
            : 'Sign up to start your own todo list.'}
        </p>

        <form onSubmit={submit} className="space-y-3">
          {mode === 'signup' && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          {notice && <p className="text-sm text-green-700">{notice}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {busy
              ? 'Please wait…'
              : mode === 'login'
                ? 'Log in'
                : 'Sign up'}
          </button>
        </form>

        <button
          onClick={() => oauthLogin('github')}
          className="mt-3 w-full rounded-lg border py-2 text-sm font-medium hover:bg-gray-50"
        >
          Continue with GitHub
        </button>

        <p className="mt-5 text-center text-sm text-gray-500">
          {mode === 'login' ? "Don't have an account? " : 'Already have one? '}
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login')
              setError('')
              setNotice('')
            }}
            className="font-medium text-indigo-600 hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </Centered>
  )
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex items-center justify-center px-4 py-16">
      {children}
    </main>
  )
}
