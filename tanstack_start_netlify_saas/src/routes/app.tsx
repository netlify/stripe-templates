import { useState } from 'react'
import {
  createFileRoute,
  redirect,
  useRouter,
} from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { Plus, Trash2 } from 'lucide-react'

import { getServerUser } from '@/lib/auth'
import {
  getTodos,
  addTodo,
  toggleTodo,
  deleteTodo,
} from '@/server/todos.functions'

export const Route = createFileRoute('/app')({
  beforeLoad: async () => {
    const user = await getServerUser()
    if (!user) {
      throw redirect({ to: '/login' })
    }
    return { user }
  },
  loader: async () => {
    const todos = await getTodos()
    return { todos }
  },
  component: TodosPage,
})

function TodosPage() {
  const { todos } = Route.useLoaderData()
  const router = useRouter()

  const addTodoFn = useServerFn(addTodo)
  const toggleTodoFn = useServerFn(toggleTodo)
  const deleteTodoFn = useServerFn(deleteTodo)

  const [title, setTitle] = useState('')
  const [busy, setBusy] = useState(false)

  const remaining = todos.filter((t) => !t.completed).length

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = title.trim()
    if (!value) return
    setBusy(true)
    try {
      await addTodoFn({ data: { title: value } })
      setTitle('')
      await router.invalidate()
    } finally {
      setBusy(false)
    }
  }

  const handleToggle = async (id: string, completed: boolean) => {
    await toggleTodoFn({ data: { id, completed } })
    await router.invalidate()
  }

  const handleDelete = async (id: string) => {
    await deleteTodoFn({ data: { id } })
    await router.invalidate()
  }

  return (
    <main className="max-w-2xl mx-auto w-full px-4 py-10">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-2xl font-bold">My Todos</h1>
        <span className="text-sm text-gray-500">
          {remaining} of {todos.length} remaining
        </span>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a todo…"
          className="flex-1 rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={busy || !title.trim()}
          className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </form>

      {todos.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          No todos yet. Add one above, or ask the assistant on the Chat page.
        </p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-lg border bg-white px-4 py-3"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => handleToggle(todo.id, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span
                className={`flex-1 text-sm ${
                  todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                }`}
              >
                {todo.title}
              </span>
              <button
                onClick={() => handleDelete(todo.id)}
                className="text-gray-400 hover:text-red-600"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
