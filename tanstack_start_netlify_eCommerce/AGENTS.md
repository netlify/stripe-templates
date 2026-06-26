# AGENTS.md

Overview of the project structure for developers and AI agents working on this codebase.

## Project Overview

An eCommerce storefront starter: a product catalog, product detail pages, search,
and a Netlify Identity account area. Products are **static placeholders** in
`src/data/products.ts` — there is no database. **Cart and checkout are
intentionally omitted**; they are the home for a future Stripe integration. Built
with TanStack Start and deployed on Netlify. See `README.md` for setup and deployment.

### Tech Stack

| Layer      | Technology                                    |
| ---------- | --------------------------------------------- |
| Framework  | TanStack Start (React 19, TanStack Router v1) |
| Auth       | Netlify Identity (`@netlify/identity`)        |
| Build      | Vite 7                                         |
| Styling    | Tailwind CSS 4                                 |
| Language   | TypeScript 5.9 (strict)                       |
| Deployment | Netlify (`@netlify/vite-plugin-tanstack-start`) |

## Directory Structure

```
src/
├── components/
│   ├── CallbackHandler.tsx     # Completes Netlify Identity hash-token flows
│   ├── Nav.tsx                 # Top nav: links, search box, cart, auth state
│   └── ProductCard.tsx         # Reusable product card + formatPrice helper
├── data/
│   └── products.ts             # Static placeholder catalog + lookup/search helpers
├── lib/
│   ├── auth.ts                 # getServerUser server function
│   ├── dev-user.ts             # AuthUser type + local dev mock user
│   └── identity-context.tsx    # Client auth context (useIdentity)
├── middleware/
│   └── identity.ts             # requireAuthMiddleware (server)
├── server/                     # Server-only modules — never import from client
│   └── current-user.ts         # Resolve user + local dev shim
├── routes/
│   ├── __root.tsx              # Providers + nav shell
│   ├── index.tsx               # Storefront landing (featured products)
│   ├── products.index.tsx      # Product grid + category filter (/products)
│   ├── products.$productId.tsx # Product detail + related (404s on unknown id)
│   ├── search.tsx              # Catalog search (/search?q=…)
│   ├── cart.tsx                # Placeholder for Stripe cart + checkout
│   ├── account.tsx             # Account area (guarded)
│   └── login.tsx               # Login / signup
├── router.tsx
└── styles.css
```

## Key Concepts

- **File-based routing** — files in `src/routes/`. `products.index.tsx` →
  `/products`; `products.$productId.tsx` → `/products/$productId`.
- **Search params** — `/products` and `/search` use `validateSearch` for
  type-safe `?category=` and `?q=` params; the Nav search box navigates to
  `/search`.
- **Static catalog** — `src/data/products.ts` is the single source of product
  data. Replace it with a real backend when wiring up Stripe.
- **Local auth shim** — Netlify Identity does not work on localhost. The server
  falls back to a mock user when `import.meta.env.DEV` or `NETLIFY_DEV=true`, so
  the account area is testable via `netlify dev`. Disabled in production.

## Where Stripe goes next

Cart and checkout are intentionally absent. Add a cart store, build `/cart` into a
real cart + Stripe Checkout session, and persist orders for the `/account` page.

## Configuration Files

| File             | Purpose                                                  |
| ---------------- | -------------------------------------------------------- |
| `vite.config.ts` | TanStack Start, React, Tailwind, Netlify plugins         |
| `tsconfig.json`  | Strict TS, `@/*` → `src/*`                               |
| `netlify.toml`   | Build (`vite build` → `dist/client`) + dev server config |
| `.env.example`   | `VITE_NETLIFY_SITE_URL` (+ Stripe keys, later)           |

## Development Commands

```bash
netlify dev          # Full local stack (auth shim) on :8888
npm run dev          # Vite only on :3000
npm run build        # Production build
npm run typecheck    # tsc --noEmit
```

## Conventions

- Components PascalCase; utilities/hooks camelCase; route files kebab-case.
- Tailwind utility classes for styling.
- Type-only imports with the `type` keyword.
- Keep `src/server/*` server-only — never import it from client components.
