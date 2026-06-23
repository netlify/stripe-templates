import { createFileRoute } from '@tanstack/react-router'
import {
  chat,
  maxIterations,
  toServerSentEventsResponse,
} from '@tanstack/ai'
import { anthropicText } from '@tanstack/ai-anthropic'

import { getCurrentUser } from '@/server/current-user'
import { createTodoTools } from '@/server/chat-tools'

const SYSTEM_PROMPT = `You are a helpful assistant embedded in a personal todo-list app.

You can help the signed-in user understand and manage THEIR OWN todo list.

CAPABILITIES (via tools):
1. listTodos — read the user's current todos (with ids and completion state)
2. addTodo — add a new todo
3. completeTodo — mark a todo complete by id

INSTRUCTIONS:
- When the user asks anything about their todos ("what's on my list?", "how many are left?",
  "what should I do next?"), call listTodos first and answer from the result.
- To add or complete items, use addTodo / completeTodo. To complete an item you must know its
  id, so call listTodos first to find it.
- Only ever talk about this user's todos — you have no access to anyone else's data.
- Be concise and friendly. Use markdown lists when showing multiple todos.`

const MODEL = 'claude-haiku-4-5'

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (request.signal.aborted) {
          return new Response(null, { status: 499 })
        }

        const user = await getCurrentUser()
        if (!user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        if (!process.env.ANTHROPIC_API_KEY) {
          return Response.json(
            {
              error:
                'ANTHROPIC_API_KEY is not set. Add it to .env.local (local) or your Netlify environment variables (production).',
            },
            { status: 400 },
          )
        }

        const abortController = new AbortController()

        try {
          const body = await request.json()
          const { messages } = body

          const stream = chat({
            adapter: anthropicText(MODEL),
            tools: createTodoTools(user.id),
            systemPrompts: [SYSTEM_PROMPT],
            agentLoopStrategy: maxIterations(5),
            messages,
            abortController,
          })

          return toServerSentEventsResponse(stream, { abortController })
        } catch (error: any) {
          console.error('Chat error:', error)
          if (error?.name === 'AbortError' || abortController.signal.aborted) {
            return new Response(null, { status: 499 })
          }
          return Response.json(
            { error: 'Failed to process chat request', message: error?.message },
            { status: 500 },
          )
        }
      },
    },
  },
})
