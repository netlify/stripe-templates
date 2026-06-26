import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { ShoppingBag, ShoppingCart, Search, LogOut } from 'lucide-react'
import { useIdentity } from '@/lib/identity-context'

export function Nav() {
  const { user, ready, logout } = useIdentity()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/' })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ to: '/search', search: { q: query.trim() } })
  }

  const linkClass =
    'px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100'
  const activeClass = 'text-gray-900 bg-gray-100'

  return (
    <header className="border-b bg-white">
      <nav className="max-w-5xl mx-auto w-full px-4 h-14 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 font-bold text-gray-900">
          <ShoppingBag className="w-5 h-5 text-indigo-600" />
          Shop
        </Link>

        <Link
          to="/products"
          className={linkClass}
          activeProps={{ className: `${linkClass} ${activeClass}` }}
        >
          Products
        </Link>

        <form onSubmit={handleSearch} className="relative ml-auto hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-48 rounded-md border pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </form>

        <div className="flex items-center gap-1 sm:ml-0 ml-auto">
          <Link
            to="/cart"
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            title="Cart"
            activeProps={{ className: 'p-2 rounded-md text-gray-900 bg-gray-100' }}
          >
            <ShoppingCart className="w-5 h-5" />
          </Link>

          {ready && user ? (
            <div className="flex items-center gap-1 pl-2 ml-1 border-l">
              <Link
                to="/account"
                className={linkClass}
                activeProps={{ className: `${linkClass} ${activeClass}` }}
              >
                Account
              </Link>
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
