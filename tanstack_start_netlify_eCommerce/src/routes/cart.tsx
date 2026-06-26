import { createFileRoute, Link } from '@tanstack/react-router'
import { ShoppingCart } from 'lucide-react'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})

function CartPage() {
  return (
    <main className="max-w-2xl mx-auto w-full px-4 py-20 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 mb-6">
        <ShoppingCart className="w-7 h-7 text-gray-400" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Your cart</h1>
      <p className="text-gray-600 max-w-md mx-auto mb-8">
        The cart and checkout flow are intentionally left out of this starter.
        They’re the natural home for the Stripe integration — wire up a cart
        store and a Stripe Checkout session here.
      </p>
      <Link
        to="/products"
        className="px-5 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
      >
        Continue shopping
      </Link>
    </main>
  )
}
