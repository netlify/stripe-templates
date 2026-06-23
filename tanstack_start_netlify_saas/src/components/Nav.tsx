import { Link, useNavigate } from '@tanstack/react-router'
import { CheckSquare, LogOut } from 'lucide-react'
import { useIdentity } from '@/lib/identity-context'

export function Nav() {
  const { user, ready, logout } = useIdentity()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/' })
  }

  const linkClass =
    'px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100'
  const activeClass = 'text-gray-900 bg-gray-100'

  return (
    <header className="border-b bg-white">
      <nav className="max-w-4xl mx-auto w-full px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-gray-900">
          <CheckSquare className="w-5 h-5 text-indigo-600" />
          Todo&nbsp;AI
        </Link>

        <div className="flex items-center gap-1">
          <Link to="/app" className={linkClass} activeProps={{ className: `${linkClass} ${activeClass}` }}>
            Todos
          </Link>
          <Link to="/chat" className={linkClass} activeProps={{ className: `${linkClass} ${activeClass}` }}>
            Chat
          </Link>

          {ready && user ? (
            <div className="flex items-center gap-2 pl-2 ml-1 border-l">
              <span className="text-sm text-gray-500 hidden sm:inline">
                {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}
