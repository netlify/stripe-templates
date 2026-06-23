# Todo AI — TanStack Start on Netlify

A small but complete multi-user todo list. Each user signs in, keeps their own
list, and can talk to an AI assistant that reads and updates their todos.

Built entirely on the Netlify + TanStack stack:

| Concern        | Technology                                             |
| -------------- | ------------------------------------------------------ |
| Framework      | [TanStack Start](https://tanstack.com/start) (React 19)|
| Auth           | **Netlify Identity** (`@netlify/identity`)             |
| Storage        | **Netlify Database** (`@netlify/database`, Neon Postgres) |
| AI assistant   | **TanStack AI** (`@tanstack/ai*`) with Anthropic Claude |
| Styling        | Tailwind CSS 4                                          |
| Hosting        | Netlify (via `@netlify/vite-plugin-tanstack-start`)    |

## How it fits together

- **Auth** — `src/lib/identity-context.tsx` (client state), `src/middleware/identity.ts`
  (server guard), and `src/lib/auth.ts` (`getServerUser`). Routes `/app` and `/chat`
  are guarded in `beforeLoad`.
- **Storage** — `src/server/db.ts` opens the Netlify Database and lazily creates the
  `todos` table. `src/server/todos.functions.ts` holds the CRUD server functions,
  each protected by `requireAuthMiddleware` and **scoped to the signed-in user's id**.
- **AI** — `src/routes/api.chat.ts` streams a Claude response over SSE. The
  assistant is given three tools (`src/server/chat-tools.ts`) — list, add, and
  complete todos — each bound to the authenticated user's id, so it can only ever
  touch that user's data. The UI in `src/routes/chat.tsx` reuses TanStack AI's
  `useChat` hook and renders markdown with `streamdown`.

## Local development

```bash
npm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY for the chat
netlify dev
```

Open http://localhost:8888.

`netlify dev` starts a **real local Postgres** automatically (no Docker), so the
todo list works locally out of the box.

### The local auth shim

Netlify Identity cannot authenticate on `localhost` — the `nf_jwt` cookie is only
issued by a real Netlify deployment. So locally the app falls back to a stable
mock user (`Local Dev`) so you can exercise the whole app — todos and chat —
without deploying. This shim lives in `src/server/current-user.ts` and
`src/lib/dev-user.ts` and is active only when `import.meta.env.DEV` or
`NETLIFY_DEV=true`. It is compiled out / disabled in production.

## Deploy to Netlify

The project is configured to deploy as-is.

1. **Create / link the site** and provision the database:
   ```bash
   netlify init      # or: netlify link
   netlify db init    # provisions serverless Neon Postgres, sets NETLIFY_DATABASE_URL
   ```
2. **Enable Identity** — in the Netlify dashboard: *Project configuration →
   Identity → Enable*. Registration is open by default; turn on *Autoconfirm* if
   you want to skip the signup confirmation email during testing.
3. **Set the AI key** — add `ANTHROPIC_API_KEY` under *Site configuration →
   Environment variables*. Optionally set `VITE_NETLIFY_SITE_URL` to your site URL.
4. **Deploy:**
   ```bash
   netlify deploy --build --prod
   ```

Once deployed, real Netlify Identity takes over (the dev shim is inactive), and
each signed-in user gets their own persistent todo list.

## Scripts

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Vite dev server (used by `netlify dev`) |
| `npm run build`     | Production build                     |
| `npm run typecheck` | `tsc --noEmit`                       |
