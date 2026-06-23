import { useEffect, useRef, useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Send, Square } from 'lucide-react'
import { Streamdown } from 'streamdown'

import { getServerUser } from '@/lib/auth'
import { useAIChat } from '@/lib/ai-hook'
import type { ChatMessages } from '@/lib/ai-hook'

export const Route = createFileRoute('/chat')({
  beforeLoad: async () => {
    const user = await getServerUser()
    if (!user) {
      throw redirect({ to: '/login' })
    }
    return { user }
  },
  component: ChatPage,
})

function Messages({ messages }: { messages: ChatMessages }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  if (!messages.length) return null

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto pb-4 min-h-0">
      <div className="max-w-2xl mx-auto w-full px-4">
        {messages.map((message) => (
          <div key={message.id} className="py-4 border-b">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg border bg-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {message.role === 'assistant' ? 'AI' : 'You'}
              </div>
              <div className="flex-1 min-w-0">
                {message.parts.map((part, index) =>
                  part.type === 'text' && part.content ? (
                    <div
                      key={index}
                      className="prose prose-sm max-w-none"
                    >
                      <Streamdown>{part.content}</Streamdown>
                    </div>
                  ) : null,
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChatPage() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, isLoading, stop } = useAIChat()

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-2xl">
            <h1 className="text-3xl font-bold mb-3">Todo Assistant</h1>
            <p className="text-gray-600">
              Ask about your list — try{' '}
              <em>"What's on my todo list?"</em>,{' '}
              <em>"Add 'buy milk'"</em>, or{' '}
              <em>"Mark the groceries one done"</em>.
            </p>
          </div>
        </div>
      )}

      <Messages messages={messages} />

      <div className="sticky bottom-0 border-t bg-white">
        <div className="max-w-2xl mx-auto w-full px-4 py-3">
          {isLoading && (
            <div className="flex justify-center mb-3">
              <button
                onClick={stop}
                className="px-4 py-2 border rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-50"
              >
                <Square className="w-4 h-4 fill-current" />
                Stop
              </button>
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (input.trim()) {
                sendMessage(input)
                setInput('')
              }
            }}
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your todos…"
                disabled={isLoading}
                className="flex-1 rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
