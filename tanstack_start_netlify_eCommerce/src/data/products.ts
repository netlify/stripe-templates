/**
 * Placeholder product catalog.
 *
 * This is intentionally static, in-memory data so the storefront boots with no
 * database or external service. Swap this module for real product data (a
 * database, a CMS, or your Stripe product catalog) when you wire up checkout.
 */

export interface Product {
  /** URL-safe identifier used in product detail routes (`/products/$productId`). */
  id: string
  name: string
  /** Price in whole-dollar units (USD). Display only — no payments yet. */
  price: number
  category: ProductCategory
  /** One-line summary shown on cards. */
  blurb: string
  /** Longer copy shown on the product detail page. */
  description: string
  /** Whether the item is in stock — drives the (placeholder) buy button. */
  inStock: boolean
}

export const CATEGORIES = ['Apparel', 'Accessories', 'Home', 'Outdoors'] as const
export type ProductCategory = (typeof CATEGORIES)[number]

export const products: Product[] = [
  {
    id: 'product-1',
    name: 'Product 1',
    price: 29,
    category: 'Apparel',
    blurb: 'A versatile everyday staple.',
    description:
      'Product 1 is a placeholder item. Replace this copy and image with your real product details. It belongs to the Apparel category and is ready for checkout once Stripe is wired up.',
    inStock: true,
  },
  {
    id: 'product-2',
    name: 'Product 2',
    price: 49,
    category: 'Apparel',
    blurb: 'Comfortable, durable, and simple.',
    description:
      'Product 2 is a placeholder item in the Apparel category. Use it to test the listing grid, product detail page, and search before adding your own catalog.',
    inStock: true,
  },
  {
    id: 'product-3',
    name: 'Product 3',
    price: 19,
    category: 'Accessories',
    blurb: 'A small upgrade that goes anywhere.',
    description:
      'Product 3 is a placeholder Accessories item. Swap in your own name, price, and description. Cart and checkout are intentionally left for the Stripe integration step.',
    inStock: true,
  },
  {
    id: 'product-4',
    name: 'Product 4',
    price: 89,
    category: 'Accessories',
    blurb: 'Premium materials, minimal design.',
    description:
      'Product 4 is a placeholder Accessories item priced a little higher so you can see a range of prices in the grid and search results.',
    inStock: false,
  },
  {
    id: 'product-5',
    name: 'Product 5',
    price: 39,
    category: 'Home',
    blurb: 'Bring a little calm to any room.',
    description:
      'Product 5 is a placeholder Home item. The detail page below demonstrates layout, related products, and the (disabled) add-to-cart action.',
    inStock: true,
  },
  {
    id: 'product-6',
    name: 'Product 6',
    price: 59,
    category: 'Home',
    blurb: 'Functional design for daily use.',
    description:
      'Product 6 is a placeholder Home item. Replace the catalog in src/data/products.ts with data from your database or CMS when you are ready.',
    inStock: true,
  },
  {
    id: 'product-7',
    name: 'Product 7',
    price: 119,
    category: 'Outdoors',
    blurb: 'Built for the trail and beyond.',
    description:
      'Product 7 is a placeholder Outdoors item. It is the most expensive item in the sample catalog, useful for testing sorting and price display.',
    inStock: true,
  },
  {
    id: 'product-8',
    name: 'Product 8',
    price: 24,
    category: 'Outdoors',
    blurb: 'Lightweight and ready to pack.',
    description:
      'Product 8 is a placeholder Outdoors item. Once Stripe is integrated, the buy button on the detail page will create a real checkout session.',
    inStock: true,
  },
]

/** Look up a single product by its id. */
export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

/** Case-insensitive search across name, blurb, description, and category. */
export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return products.filter((p) =>
    [p.name, p.blurb, p.description, p.category]
      .join(' ')
      .toLowerCase()
      .includes(q),
  )
}

/** Products in the same category, excluding the given product. */
export function relatedProducts(product: Product, limit = 3): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit)
}
