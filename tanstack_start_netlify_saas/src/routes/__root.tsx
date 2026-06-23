import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import { IdentityProvider } from '@/lib/identity-context'
import { CallbackHandler } from '@/components/CallbackHandler'
import { Nav } from '@/components/Nav'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Todo AI — TanStack Start on Netlify' },
      {
        name: 'description',
        content:
          'A multi-user todo list with Netlify Identity auth, Netlify Database storage, and a TanStack AI assistant.',
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <IdentityProvider>
          <CallbackHandler>
            <Nav />
            {children}
          </CallbackHandler>
        </IdentityProvider>
        <Scripts />
      </body>
    </html>
  )
}
