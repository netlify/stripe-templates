# AGENTS.md

Overview of the project structure for developers and AI agents working on this codebase.

## Project Overview

A multi-user todo list with an AI assistant. Users sign in with **Netlify
Identity**, their todos persist in **Netlify Database** (Neon Postgres), and a
**TanStack AI** chat assistant can read and modify each user's list via server
tools. Built with TanStack Start and deployed on Netlify. See `README.md` for
setup and deployment.

### Tech Stack

| Layer       | Technology                                          |
| ----------- | --------------------------------------------------- |
| Framework   | TanStack Start (React 19, TanStack Router v1)       |
| Auth        | Netlify Identity (`@netlify/identity`)              |
| Storage     | Netlify Database (`@netlify/database`, Neon Postgres) |
| AI          | TanStack AI (`@tanstack/ai*`) + Anthropic Claude    |
| Build       | Vite 7                                              |
| Styling     | Tailwind CSS 4                                       |
| Language    | TypeScript 5.9 (strict)                             |
| Deployment  | Netlify (`@netlify/vite-plugin-tanstack-start`)     |

## Directory Structure

```
src/
├── components/
│   ├── CallbackHandler.tsx   # Completes Netlify Identity hash-token flows
│   └── Nav.tsx               # Top nav, shows auth state via useIdentity
├── lib/
│   ├── auth.ts               # getServerUser server function
│   ├── dev-user.ts           # AuthUser type + local dev mock user
│   ├── identity-context.tsx  # Client auth context (useIdentity)
│   └── ai-hook.ts            # useAIChat — TanStack AI client hook
├── middleware/
│   └── identity.ts           # requireAuthMiddleware (server)
├── server/                   # Server-only modules — never import from client
│   ├── current-user.ts       # Resolve user + local dev shim
│   ├── db.ts                 # Netlify Database connection + lazy schema
│   ├── todos.functions.ts    # Todo CRUD server functions (per-user scoped)
│   └── chat-tools.ts         # TanStack AI tools bound to a user id
├── routes/
│   ├── __root.tsx            # Providers + nav shell
│   ├── index.tsx             # Landing page
│   ├── login.tsx             # Login / signup
│   ├── app.tsx               # Todo list (guarded)
│   ├── chat.tsx              # AI assistant (guarded)
│   └── api.chat.ts           # SSE chat endpoint (Anthropic + todo tools)
├── router.tsx
└── styles.css
```

## Key Concepts

- **File-based routing** — files in `src/routes/`. `api.*.ts` become server
  endpoints (`api.chat.ts` → `/api/chat`).
- **Server functions** — use `.inputValidator(...)` (NOT `.validator(...)`).
  Auth-protected functions chain `.middleware([requireAuthMiddleware])` and read
  `context.user`.
- **Per-user scoping** — every todo query filters by `user_id`, so users only
  ever see and modify their own data. The chat tools are bound to the
  authenticated user's id the same way.
- **Local auth shim** — Netlify Identity does not work on localhost. The server
  falls back to a mock user when `import.meta.env.DEV` or `NETLIFY_DEV=true`, so
  the app is fully testable via `netlify dev`. Disabled in production.

## Configuration Files

| File             | Purpose                                                  |
| ---------------- | -------------------------------------------------------- |
| `vite.config.ts` | TanStack Start, React, Tailwind, Netlify plugins         |
| `tsconfig.json`  | Strict TS, `@/*` → `src/*`                               |
| `netlify.toml`   | Build (`vite build` → `dist/client`) + dev server config |
| `.env.example`   | `ANTHROPIC_API_KEY`, `VITE_NETLIFY_SITE_URL`             |

## Development Commands

```bash
netlify dev          # Full local stack (auth shim + local Postgres) on :8888
npm run dev          # Vite only (no database)
npm run build        # Production build
npm run typecheck    # tsc --noEmit
```

## Conventions

- Components PascalCase; utilities/hooks camelCase; route files kebab-case.
- Tailwind utility classes for styling.
- Zod for runtime validation; type-only imports with the `type` keyword.
- Keep `src/server/*` server-only — never import it from client components.
