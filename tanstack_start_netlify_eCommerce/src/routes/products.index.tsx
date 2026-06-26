import { createFileRoute, Link } from '@tanstack/react-router'

import { CATEGORIES, products, type ProductCategory } from '@/data/products'
import { ProductCard } from '@/components/ProductCard'

interface ProductsSearch {
  category?: ProductCategory
}

export const Route = createFileRoute('/products/')({
  validateSearch: (search: Record<string, unknown>): ProductsSearch => {
    const category = search.category
    return typeof category === 'string' &&
      (CATEGORIES as readonly string[]).includes(category)
      ? { category: category as ProductCategory }
      : {}
  },
  component: ProductsPage,
})

function ProductsPage() {
  const { category } = Route.useSearch()

  const visible = category
    ? products.filter((p) => p.category === category)
    : products

  const chipClass =
    'px-3 py-1.5 rounded-full text-sm font-medium border hover:bg-gray-100'
  const activeChip = 'bg-gray-900 text-white border-gray-900 hover:bg-gray-900'

  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">All products</h1>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          to="/products"
          className={`${chipClass} ${!category ? activeChip : 'bg-white'}`}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            to="/products"
            search={{ category: c }}
            className={`${chipClass} ${category === c ? activeChip : 'bg-white'}`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  )
}
