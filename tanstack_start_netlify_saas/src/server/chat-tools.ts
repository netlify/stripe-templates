// Server-only TanStack AI tools. Each tool is bound to a specific user id so the
// assistant can only ever read or modify the todos of the authenticated user.
import { toolDefinition } from '@tanstack/ai'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { getDb } from './db'

const listTodosDef = toolDefinition({
  name: 'listTodos',
  description:
    "List all of the current user's todo items, including each item's id and whether it is completed.",
  inputSchema: z.object({}),
  outputSchema: z.object({
    todos: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        completed: z.boolean(),
      }),
    ),
  }),
})

const addTodoDef = toolDefinition({
  name: 'addTodo',
  description: "Add a new todo item to the current user's list.",
  inputSchema: z.object({
    title: z.string().describe('The text of the todo item to add'),
  }),
  outputSchema: z.object({ id: z.string(), title: z.string() }),
})

const completeTodoDef = toolDefinition({
  name: 'completeTodo',
  description:
    "Mark one of the current user's todo items as completed, identified by its id (use listTodos first to find the id).",
  inputSchema: z.object({
    id: z.string().describe('The id of the todo item to mark complete'),
  }),
  outputSchema: z.object({ success: z.boolean() }),
})

/** Build the set of todo tools scoped to a single authenticated user. */
export function createTodoTools(userId: string) {
  const listTodos = listTodosDef.server(async () => {
    const sql = await getDb()
    const todos = await sql<{ id: string; title: string; completed: boolean }>`
      SELECT id, title, completed
      FROM todos
      WHERE user_id = ${userId}
      ORDER BY created_at ASC
    `
    return { todos }
  })

  const addTodo = addTodoDef.server(async (args) => {
    const { title } = args as { title: string }
    const sql = await getDb()
    const id = randomUUID()
    await sql`
      INSERT INTO todos (id, user_id, title, completed)
      VALUES (${id}, ${userId}, ${title}, false)
    `
    return { id, title }
  })

  const completeTodo = completeTodoDef.server(async (args) => {
    const { id } = args as { id: string }
    const sql = await getDb()
    await sql`
      UPDATE todos SET completed = true
      WHERE id = ${id} AND user_id = ${userId}
    `
    return { success: true }
  })

  return [listTodos, addTodo, completeTodo]
}
