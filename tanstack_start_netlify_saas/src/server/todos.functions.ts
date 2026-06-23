import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { requireAuthMiddleware } from '@/middleware/identity'
import { getDb, type Todo } from './db'

export type { Todo }

/** Fetch the current user's todos, oldest first. */
export const getTodos = createServerFn({ method: 'GET' })
  .middleware([requireAuthMiddleware])
  .handler(async ({ context }): Promise<Todo[]> => {
    const sql = await getDb()
    const rows = await sql<Todo>`
      SELECT id, user_id, title, completed, created_at
      FROM todos
      WHERE user_id = ${context.user.id}
      ORDER BY created_at ASC
    `
    return rows
  })

/** Add a todo for the current user. */
export const addTodo = createServerFn({ method: 'POST' })
  .middleware([requireAuthMiddleware])
  .inputValidator(z.object({ title: z.string().trim().min(1).max(500) }))
  .handler(async ({ context, data }): Promise<Todo> => {
    const sql = await getDb()
    const id = randomUUID()
    const [todo] = await sql<Todo>`
      INSERT INTO todos (id, user_id, title, completed)
      VALUES (${id}, ${context.user.id}, ${data.title}, false)
      RETURNING id, user_id, title, completed, created_at
    `
    return todo
  })

/** Toggle (or set) a todo's completed state. Scoped to the current user. */
export const toggleTodo = createServerFn({ method: 'POST' })
  .middleware([requireAuthMiddleware])
  .inputValidator(z.object({ id: z.string(), completed: z.boolean() }))
  .handler(async ({ context, data }): Promise<{ success: boolean }> => {
    const sql = await getDb()
    await sql`
      UPDATE todos
      SET completed = ${data.completed}
      WHERE id = ${data.id} AND user_id = ${context.user.id}
    `
    return { success: true }
  })

/** Delete a todo. Scoped to the current user. */
export const deleteTodo = createServerFn({ method: 'POST' })
  .middleware([requireAuthMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ context, data }): Promise<{ success: boolean }> => {
    const sql = await getDb()
    await sql`
      DELETE FROM todos
      WHERE id = ${data.id} AND user_id = ${context.user.id}
    `
    return { success: true }
  })
