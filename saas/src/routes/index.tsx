import { createFileRoute, Link } from '@tanstack/react-router'
import { CheckSquare, Database, Lock, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Home,
})

const features = [
  {
    icon: Lock,
    title: 'Netlify Identity',
    body: 'Each user signs in and sees only their own list. Auth runs on real Netlify deploys.',
  },
  {
    icon: Database,
    title: 'Netlify Database',
    body: 'Todos persist in serverless Postgres, scoped per user via type-safe server functions.',
  },
  {
    icon: Sparkles,
    title: 'TanStack AI',
    body: 'Ask an assistant about your list — it reads and updates your todos with server tools.',
  },
]

function Home() {
  return (
    <main className="max-w-4xl mx-auto w-full px-4">
      <section className="text-center py-16 sm:py-24">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-6">
          <CheckSquare className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
          A multi-user todo list, with an AI that knows your list
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Built on TanStack Start and deployed to Netlify out of the box — using
          Netlify Identity for login, Netlify Database for storage, and TanStack
          AI for a todo-aware chat assistant.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/app"
            className="px-5 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
          >
            Open my todos
          </Link>
          <Link
            to="/chat"
            className="px-5 py-3 rounded-lg border border-gray-300 bg-white font-medium hover:bg-gray-100"
          >
            Ask the assistant
          </Link>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4 pb-20">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border bg-white p-5">
            <f.icon className="w-6 h-6 text-indigo-600 mb-3" />
            <h2 className="font-semibold mb-1">{f.title}</h2>
            <p className="text-sm text-gray-600">{f.body}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
