import { createFileRoute, redirect } from '@tanstack/react-router'
import { Package } from 'lucide-react'

import { getServerUser } from '@/lib/auth'

export const Route = createFileRoute('/account')({
  beforeLoad: async () => {
    const user = await getServerUser()
    if (!user) {
      throw redirect({ to: '/login' })
    }
    return { user }
  },
  loader: ({ context }) => ({ user: context.user }),
  component: AccountPage,
})

function AccountPage() {
  const { user } = Route.useLoaderData()

  return (
    <main className="max-w-2xl mx-auto w-full px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Your account</h1>

      <div className="rounded-xl border bg-white p-6 mb-6">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">Name</dt>
            <dd className="font-medium">{user.name || '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">Email</dt>
            <dd className="font-medium">{user.email || '—'}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-5 h-5 text-gray-400" />
          <h2 className="font-semibold">Order history</h2>
        </div>
        <p className="text-sm text-gray-600">
          Orders will appear here once checkout is wired up with Stripe.
        </p>
      </div>
    </main>
  )
}
