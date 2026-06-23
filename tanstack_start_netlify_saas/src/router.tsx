import { createRouter } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: () => (
      <main className="max-w-2xl mx-auto w-full px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <Link to="/" className="text-indigo-600 hover:underline">
          Go home
        </Link>
      </main>
    ),
    defaultErrorComponent: ({ error }) => (
      <main className="max-w-2xl mx-auto w-full px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-sm text-gray-600">{error.message}</p>
      </main>
    ),
  })

  return router
}
