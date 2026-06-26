import { createFileRoute, Link } from '@tanstack/react-router'
import { ShoppingBag } from 'lucide-react'

import { products } from '@/data/products'
import { ProductCard } from '@/components/ProductCard'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const featured = products.slice(0, 4)

  return (
    <main className="max-w-5xl mx-auto w-full px-4">
      <section className="text-center py-16 sm:py-24">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-6">
          <ShoppingBag className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
          A storefront starter for TanStack Start
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Browse products, view details, and search — all built on TanStack
          Start and deployed to Netlify. Cart and checkout are ready to wire up
          with Stripe.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/products"
            className="px-5 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
          >
            Shop all products
          </Link>
          <Link
            to="/search"
            search={{ q: '' }}
            className="px-5 py-3 rounded-lg border border-gray-300 bg-white font-medium hover:bg-gray-100"
          >
            Search
          </Link>
        </div>
      </section>

      <section className="pb-20">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-bold">Featured</h2>
          <Link to="/products" className="text-sm text-indigo-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}
