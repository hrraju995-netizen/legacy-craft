# CHANGELOG — Legacy Craft Studio frontend

Full repair pass. `npm run build` passes; every route was smoke-tested against
`next start`. Files listed are relative to `frontend/`.

---

## 🔴 Critical — the site was broken before these

### Product detail page was completely dead
`src/app/products/[id]/page.jsx` was written as
`export default function ProductDetails({ product })`, but Next.js never passes
a `product` prop to a page — it passes `{ params }`. `product` was always
`undefined`, so **every product page rendered only "Product not found!"**.

- Route renamed `[id]` → `[slug]`.
- `src/app/products/[slug]/page.jsx` is now a **server component**: it awaits
  `params`, looks the product up, and calls `notFound()` for unknown slugs.
- The 400-line UI moved to `src/components/product/ProductDetails.jsx` (client).
- Added `generateStaticParams` (all 24 products prerendered at build time),
  `generateMetadata`, and Product JSON-LD.

### Rules of Hooks violation in the same file
`if (!product) return …` sat **above** `useState`/`useEffect`, making the hook
calls conditional. Removed — the server page 404s first, so the component can
assume a product exists.

### Category page ignored its own URL
`src/app/categories/[category]/page.jsx` never read `params`. It had a
hard-coded title (`"Storage & Organizer"`) and 20 hard-coded products, so
`/categories/beds`, `/categories/sofas` and every other URL rendered the
**same page**. Now resolves the category from `params`, filters the real
catalogue, and 404s on unknown slugs.

### "Add to cart" / "Buy it now" did nothing
Both buttons on the product page had no `onClick`. Wired to the store, plus a
new wishlist button and a related-products section.

### Every home-page link pointed at a route that did not exist

| Was | Now |
| --- | --- |
| `/category/bedroom` … (10 links) | `/products?q=Bedroom` etc. |
| `/product/teak-bed` … (17 hotspots) | real `/products/{slug}` |
| `/product/renox-dressing-table` … (6) | real `/products/{slug}` |
| `/products/beds`, `/products/sofas` … (9) | `/categories/{real-slug}` |
| `/new-arrivals` | `/products?sort=newest` |
| `/rooms`, `/room-inspiration` | `/categories` |
| `/catalog` | `/products` |
| `/products/{cat}/{sub}` (subcategory tiles) | now filter buttons, no navigation |

`GetTheLook` hotspots used to carry hand-typed titles and prices; they now name
a real product and read label/price/image/href from the catalogue.

---

## 🟠 Data model

Three different product shapes were in circulation (`name`/`title`,
`thumbnail`/`image`, numeric vs `"37,000"` string prices). The cart and wishlist
pages read `item.title`/`item.image`/`item.link`, which the catalogue never
produced — so `<Image src={undefined}>` threw at runtime.

- **`src/data/products.js` is the single source of truth.** Expanded 10 → 24
  products across 9 categories and 8 room types; every record now has the same
  key set (`categorySlug`, `subcategorySlug`, `roomSlug`, `sizeLabel`,
  `createdAt`, `shortDescription`, …).
- **`src/lib/catalog.js`** (new) — lookups, facets, `filterProducts`,
  `sortProducts`, shared `PRICE_RANGES` / `SIZE_OPTIONS` / `SORT_OPTIONS`.
- **`src/store/useCartStore.js` normalises on write** via `toCartItem()`, so
  cart/wishlist/checkout only ever see one shape. Persist bumped to `version: 2`
  with a `migrate` step so existing localStorage carts are re-normalised instead
  of breaking.
- `NewArrivals` had its own hard-coded array with `id: 1…6` — these **collided
  in the cart** with the category page's `id: 1…20` items, merging unrelated
  products. Deleted; it reads the catalogue now.
- Deleted `src/data/categoriesData.js` (imported nowhere).

---

## 🟡 Correctness & consistency

- **Shipping cost disagreed between pages** — cart charged ৳70/৳130, checkout
  charged ৳60/৳120 for the same order. Both now use `getShippingCost()` from
  the new `src/config/site.js`, plus free delivery over ৳50,000.
- **Three `<ToastContainer />` mounted** (layout, checkout, wishlist,
  NewArrivals) → one, in the layout.
- `ProductGrid` referenced `state.addToWishlist`, which never existed on the
  store; `window.location.href` replaced with `router.push`.
- Filter sidebar advertised invented counts ("120 items") and price bands that
  matched no product. Options now derive from the catalogue.
- Breadcrumb was hard-coded `Rooms > Storage & Organizer` on every page; now
  takes a real trail.
- CRLF → LF across all source files.

---

## 🟢 SEO, performance, UX

- **Navbar was invisible to crawlers** — it returned an empty `<div>` until
  `isMounted`. Now renders server-side; only the cart/wishlist count badges wait
  for hydration.
- **18 dead `href="#"` in the Navbar** and **8 in the Footer** → real routes.
  Footer contact details moved to `siteConfig` (it was showing
  `info@fitmentcraft.com`, another brand's address). Its background colour
  `bg-[#E8F5EF9F0E09]` was an invalid 11-digit hex that Tailwind silently
  dropped.
- **Image optimisation was entirely off.** `next.config.mjs` had
  `hostname: '*.*'`, not a valid pattern, which is why all 19 `<Image>` were
  marked `unoptimized`. Real hostnames configured, `unoptimized` removed,
  AVIF/WebP enabled, and a `sizes` hint added to every `fill` image (without it
  Next serves full-viewport images to phones).
- Added: root `metadata` with OG/Twitter/canonical, `generateMetadata` on
  product and category routes, `sitemap.js`, `robots.js`, FurnitureStore +
  Product JSON-LD, and `app/error.jsx`.
- Root `app/loading.js` was a full-screen overlay that flashed on every
  navigation **and** put the whole app behind a Suspense boundary. Moved to
  `src/components/StoreLoader.jsx`; every route is now prerendered (no `ƒ`
  dynamic routes at all).
- Login/signup validated nothing and just `console.log`-ed. Added Bangladeshi
  phone + password validation, inline errors, disabled submit state — and,
  since there is no auth backend, they say so instead of faking success. Same
  for the contact form, which previously claimed "Message sent successfully!"
  while sending nothing.

---

## ⚠️ Known issue — unresolved

**Unknown slugs return HTTP 200 instead of 404.**
`/products/does-not-exist` and `/categories/does-not-exist` render the correct
404 *screen*, but the response status is 200 — a "soft 404" that lets search
engines index junk URLs. Everything else 404s correctly (`/totally-random`
returns a proper 404).

Four fixes were attempted and verified as ineffective on Next 16.3.1 +
Turbopack under `next start`:

1. `notFound()` in the server page — renders the 404 UI, status stays 200.
2. `export const dynamicParams = false` — not enforced; `generateMetadata`
   still runs for unknown slugs.
3. Removing the root `loading.js` and all `searchParams` usage so both routes
   are fully static — no change.
4. `src/proxy.js` (Next 16's renamed middleware) rejecting unknown slugs before
   render — compiles and is listed in the build output, but did not execute.

`src/proxy.js` is left in place because it matches the documented Next 16
convention and will likely work on a real deployment. **Re-test after
deploying.** If unknown slugs still answer 200 there, handle it at the CDN/edge
layer, or upgrade Next and retry.

---

## Not done — needs backend work

These are missing features, not bugs, and all need a server:

- No authentication. Login/signup are UI only.
- Checkout writes the order to `localStorage`; no order API, no payment.
- Contact form does not send mail.
- Products are a static file; no CMS or admin.
- `Navbar.jsx` is still ~800 lines. Its links work now, but the menu data
  belongs in a separate file and the component should be split.
