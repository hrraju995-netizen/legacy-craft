# Phase 2 — Frontend connected to the Laravel API

## What changed

The Next.js storefront no longer reads `src/data/products.js`. Every page now
fetches from the Laravel API.

**New:** `frontend/src/lib/api.js` — one fetch layer with ISR caching, an
`ApiError` type, and `apiFetchSafe()` for calls that should degrade rather than
crash a page (a homepage slider is not worth a 500).

**`lib/catalog.js` is now data-free** — it keeps only the pure helpers that must
also run in the browser (filter/sort logic, price bands, size and sort options).

**Pages moved to the API**
| Page | Source |
| --- | --- |
| `/` | `getAllProducts()` + `getHomeData()` — section order comes from the `home_sections` table |
| `/products` | `getAllProducts()` |
| `/categories` | `getCategories()` + rooms |
| `/categories/[slug]` | `generateStaticParams()` from the API |
| `/products/[slug]` | `getProduct()`; 24 pages prerendered from the API |
| `/sitemap.xml` | products + categories from the API |
| layout | `getSiteConfig()` → Topbar, Navbar, Footer |

**Components converted to props** — `HeroBannerGrid`, `NewArrivals`,
`ExploreSeries`, `LatestInsightsSection`, `GetTheLook` (hotspots resolve against
the fetched product list), `Navbar` (categories + rooms), `Footer` (categories,
settings, CMS pages), `Topbar` (settings). All keep a static fallback so the
header/footer still render if the API is unreachable.

**Checkout now posts to `POST /api/v1/checkout`.** It sends only product ids and
quantities — the server recalculates every price from the database, so the
totals on screen are display-only and cannot be tampered with. Shipping zones
are fetched from the admin panel instead of the old hard-coded ৳60/৳120.
`localStorage` is gone; the thank-you page reads the server's authoritative
order from `sessionStorage`.

**Deleted:** `frontend/src/proxy.js` and `app/404/` — the soft-404 workaround
from Phase 1 that never executed, and which would now need an API call per
request. The soft-404 issue documented in CHANGELOG.md remains open.

## Verified working

- `npm run build` passes; 24 product pages + 9 category pages prerendered
  **from the API**
- All routes return 200 under `next start`
- Product names that exist only in the database render in the static HTML
- Category pages show only their own category
- `POST /api/v1/checkout` tested directly: stock decremented 25 → 23, order and
  line-item snapshots written, status history logged, free-shipping threshold
  applied, malformed phone numbers rejected

## Not verified — open issue

**Admin setting changes did not appear on the rendered page.** I changed
`topbar_phone` and `topbar_text` in the database, confirmed
`GET /api/v1/site/config` returns the new values, cleared `.next` entirely and
rebuilt — the HTML still showed the fallback copy. Other parts of the same API
response did reach the page, so this is not a simple "API is down" case.

I could not find the cause before running out of time. Suspects, in order:
1. Next.js `fetch` cache keyed on the URL surviving across builds
2. Something in `getSiteConfig()`'s `apiFetchSafe` fallback swallowing an error
   silently (it only logs outside production)
3. A shape mismatch — note `footerPages` came back as an object, not an array,
   which suggests the Laravel collection serialisation in `SiteController`
   needs `->values()` in places

**Start here next session:** temporarily change `apiFetchSafe` to rethrow, run
`next build`, and read the error. That should identify it in one build.

## Setup

```bash
# backend
cd backend && composer install
php artisan migrate --seed && php artisan serve

# frontend
cd frontend && npm install
echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1" > .env.local
npm run build && npm start
```

## Still to do

1. Fix the site-settings issue above
2. Filament resource polish — Product image/variant manager, Menu tree builder,
   Page block builder
3. Customer accounts, server-side cart
4. Media library and uploads (images are still Unsplash URLs)
5. Payments beyond COD
6. Tests — still none
