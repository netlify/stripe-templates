import { Link } from '@tanstack/react-router'
import { Package } from 'lucide-react'
import type { Product } from '@/data/products'

/** Format a whole-dollar price for display. */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/products/$productId"
      params={{ productId: product.id }}
      className="group flex flex-col rounded-xl border bg-white overflow-hidden hover:shadow-sm transition-shadow"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-300">
        <Package className="w-12 h-12" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-gray-900 group-hover:text-indigo-600">
            {product.name}
          </h3>
          <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="mt-1 text-xs uppercase tracking-wide text-gray-400">
          {product.category}
        </p>
        <p className="mt-2 text-sm text-gray-600 flex-1">{product.blurb}</p>
        {!product.inStock && (
          <p className="mt-2 text-xs font-medium text-amber-600">Out of stock</p>
        )}
      </div>
    </Link>
  )
}
