# Shop — TanStack Start on Netlify

A small but complete eCommerce storefront starter. Browse a catalog, open a
product detail page, search the catalog, and sign in to an account area —
all server-rendered with TanStack Start and deployed on Netlify.

Products are **static placeholders** (`Product 1`, `Product 2`, …) so the app
boots with no database or external service. **Cart and checkout are
intentionally left out** — they are the natural home for a Stripe integration.

Built on the Netlify + TanStack stack:

| Concern   | Technology                                              |
| --------- | ------------------------------------------------------- |
| Framework | [TanStack Start](https://tanstack.com/start) (React 19) |
| Auth      | **Netlify Identity** (`@netlify/identity`)              |
| Styling   | Tailwind CSS 4                                          |
| Hosting   | Netlify (via `@netlify/vite-plugin-tanstack-start`)     |

## How it fits together

- **Catalog** — `src/data/products.ts` holds the placeholder product catalog plus
  small helpers (`getProduct`, `searchProducts`, `relatedProducts`). Replace this
  module with data from a database, CMS, or your Stripe product catalog.
- **Pages** — file-based routes in `src/routes/`:
  - `/` — storefront landing with featured products
  - `/products` — product grid with category filtering (`?category=…`)
  - `/products/$productId` — product detail page with related products (404s on unknown ids)
  - `/search` — full-text search over the catalog (`?q=…`)
  - `/cart` — placeholder for the Stripe cart + checkout flow
  - `/account` — signed-in account area (guarded by Netlify Identity)
  - `/login` — sign in / sign up
- **Auth** — `src/lib/identity-context.tsx` (client state), `src/middleware/identity.ts`
  (server guard), and `src/lib/auth.ts` (`getServerUser`). The `/account` route is
  guarded in `beforeLoad`.

## Where Stripe goes next

This starter deliberately stops short of payments. To turn it into a real store:

1. Add a cart store (e.g. a TanStack Store) and "add to cart" wiring on the
   product detail page (the button is already there, disabled).
2. Build the `/cart` page into a real cart + a Stripe Checkout session.
3. Persist orders (Netlify Database / Neon is a good fit) and list them on `/account`.

## Local development

```bash
npm install
netlify dev
```

Open http://localhost:8888 (or `npm run dev` for the Vite server on :3000).

### The local auth shim

Netlify Identity cannot authenticate on `localhost` — the `nf_jwt` cookie is only
issued by a real Netlify deployment. So locally the app falls back to a stable
mock user (`Local Dev`) so you can exercise the account area without deploying.
This shim lives in `src/server/current-user.ts` and `src/lib/dev-user.ts` and is
active only when `import.meta.env.DEV` or `NETLIFY_DEV=true`. It is compiled out /
disabled in production.

## Deploy to Netlify

The project is configured to deploy as-is.

1. **Create / link the site:**
   ```bash
   netlify init      # or: netlify link
   ```
2. **Enable Identity** — in the Netlify dashboard: *Project configuration →
   Identity → Enable*. Registration is open by default; turn on *Autoconfirm* if
   you want to skip the signup confirmation email during testing.
3. **Deploy:**
   ```bash
   netlify deploy --build --prod
   ```

Once deployed, real Netlify Identity takes over (the dev shim is inactive).

## Scripts

| Script              | Description                             |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Vite dev server (used by `netlify dev`) |
| `npm run build`     | Production build                        |
| `npm run typecheck` | `tsc --noEmit`                          |
