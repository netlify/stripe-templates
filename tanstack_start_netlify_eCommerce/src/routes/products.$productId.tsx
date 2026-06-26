import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ChevronLeft, Package, ShoppingCart } from 'lucide-react'

import { getProduct, relatedProducts } from '@/data/products'
import { ProductCard, formatPrice } from '@/components/ProductCard'

export const Route = createFileRoute('/products/$productId')({
  loader: ({ params }) => {
    const product = getProduct(params.productId)
    if (!product) throw notFound()
    return { product, related: relatedProducts(product) }
  },
  component: ProductDetail,
  notFoundComponent: () => (
    <main className="max-w-5xl mx-auto w-full px-4 py-20 text-center">
      <h1 className="text-2xl font-bold mb-2">Product not found</h1>
      <Link to="/products" className="text-indigo-600 hover:underline">
        Back to all products
      </Link>
    </main>
  ),
})

function ProductDetail() {
  const { product, related } = Route.useLoaderData()

  return (
    <main className="max-w-5xl mx-auto w-full px-4 py-10">
      <Link
        to="/products"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        All products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300">
          <Package className="w-20 h-20" />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
            {product.category}
          </p>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl font-semibold mb-4">
            {formatPrice(product.price)}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <button
            type="button"
            disabled={!product.inStock}
            title="Cart and checkout arrive with the Stripe integration"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4" />
            {product.inStock ? 'Add to cart' : 'Out of stock'}
          </button>
          <p className="mt-3 text-xs text-gray-400">
            Cart and checkout are added in the Stripe integration step.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-4">More in {product.category}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
