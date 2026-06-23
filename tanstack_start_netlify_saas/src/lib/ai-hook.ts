import {
  createChatClientOptions,
  fetchServerSentEvents,
  useChat,
} from '@tanstack/ai-react'
import type { InferChatMessages } from '@tanstack/ai-react'

const chatOptions = createChatClientOptions({
  connection: fetchServerSentEvents('/api/chat'),
})

export type ChatMessages = InferChatMessages<typeof chatOptions>

export const useAIChat = () => {
  const options = createChatClientOptions({
    connection: fetchServerSentEvents('/api/chat'),
  })
  return useChat(options)
}
