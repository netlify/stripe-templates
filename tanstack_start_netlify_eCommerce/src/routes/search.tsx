import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Search as SearchIcon } from 'lucide-react'

import { searchProducts } from '@/data/products'
import { ProductCard } from '@/components/ProductCard'

interface SearchParams {
  q: string
}

export const Route = createFileRoute('/search')({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search.q === 'string' ? search.q : '',
  }),
  component: SearchPage,
})

function SearchPage() {
  const { q } = Route.useSearch()
  const navigate = useNavigate({ from: '/search' })
  const [input, setInput] = useState(q)

  const results = searchProducts(q)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ search: { q: input.trim() } })
  }

  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Search</h1>

      <form onSubmit={submit} className="relative max-w-md mb-8">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search products…"
          autoFocus
          className="w-full rounded-lg border pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </form>

      {q ? (
        results.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {results.length} result{results.length === 1 ? '' : 's'} for “{q}”
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500 py-12 text-center">
            No products match “{q}”. Try another search.
          </p>
        )
      ) : (
        <p className="text-gray-500 py-12 text-center">
          Type above to search the catalog by name, category, or description.
        </p>
      )}
    </main>
  )
}
