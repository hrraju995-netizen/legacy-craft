# Legacy Craft Studio — Laravel Backend (Phase 1)

Laravel 13 + Filament 5 admin panel + REST API for the Next.js storefront.

## Run it

```bash
cd backend
composer install
cp .env.example .env && php artisan key:generate
touch database/database.sqlite          # or point DB_* at MySQL
php artisan migrate --seed
php artisan serve
```

- **Admin panel:** http://127.0.0.1:8000/admin
- **Login:** `admin@legacycraftstudio.com` / `password` — **change this immediately**
- **API base:** http://127.0.0.1:8000/api/v1

## What is built and verified working

### Database — 30+ tables
| Domain | Tables |
| --- | --- |
| Catalogue | categories, rooms, brands, products, product_images, colors, product_variants, tags, product_tag, product_related, reviews |
| Sales | customers, addresses, carts, cart_items, coupons, orders, order_items, order_status_histories |
| Delivery | shipping_zones, shipping_areas, couriers, consignments, courier_webhook_logs |
| Site | settings, menus, menu_items, pages, home_sections, banners, tooltips, lookbooks, lookbook_hotspots, media, contact_messages, subscribers |

**All money is stored as integers (paisa), never floats.** The API converts to
taka on the way out.

### API — tested end to end
```
GET  /api/v1/products?category=&room=&sub=&size=&q=&min_price=&max_price=&sort=&per_page=
GET  /api/v1/products/{slug}
GET  /api/v1/categories
GET  /api/v1/site/config     → settings, menus, shipping zones, tooltips, footer pages
GET  /api/v1/site/home       → homepage sections, banners, categories, rooms, lookbooks
GET  /api/v1/pages/{slug}
POST /api/v1/checkout
GET  /api/v1/orders/{orderNumber}/track?phone=
POST /api/v1/contact
POST /api/v1/subscribe
POST /api/webhooks/courier/{code}
```

`ProductResource` returns **exactly the object shape the storefront's
`src/data/products.js` already used** — `name`, `slug`, `categorySlug`,
`price`, `originalPrice`, `discountPercent`, `thumbnail`, `images`, `colors`,
`dimensions`, `sizeLabel`… so the React components need no rewriting.

Verified in this build:
- Filters, search, sorting, pagination
- Checkout: prices re-read from the DB (never trusted from the client), stock
  checked and decremented, coupon applied, free-shipping threshold honoured,
  order + line-item snapshots written, status history logged
- Validation rejects malformed phone numbers
- Order tracking by order number + phone

### Admin panel
Filament resources generated for Product, Category, Order, Customer,
ShippingZone, Courier, Coupon, Menu, Page, Banner, Tooltip, HomeSection, Color,
Room, Review, ContactMessage.

- **Site Settings page** builds its own fields from the `settings` table —
  adding a row adds a field, no code change. Tabs: General, Top Bar, Header,
  Footer, SEO, Social, Checkout, Floating Chat.
- **Orders table**: status badges, filters, inline status change (writes to the
  audit trail), bulk confirm, and a **Send to Courier** action.

### Courier (Steadfast)
`app/Services/Courier/` — a `CourierDriver` interface, a `SteadfastDriver`
(create consignment, track status, handle webhooks, phone normalisation), and a
`CourierManager` that resolves a driver from the DB record. Adding Pathao/RedX
means writing one class.

API credentials are `encrypted` casts — never plain text, never exposed.
Webhook payloads are logged before processing so a parse failure never loses a
delivery update.

Steadfast is seeded as **inactive**. Enter real credentials in
Admin → Couriers, then switch it on.

---

## Not done yet — Phase 2

This is the foundation, not the finished product. Still to build:

1. **Filament resource polish.** The generated resources are scaffolding — only
   Orders has a hand-built table. Products needs an image repeater, variant
   matrix and stock manager; Menu needs a drag-and-drop tree builder; Page needs
   the block builder wired to the `blocks` JSON column.
2. **Connect the frontend.** The Next.js app still reads
   `src/data/products.js`. It needs a `lib/api.js` fetch layer and the
   components repointed at the API.
3. **Customer accounts.** `Customer` + Sanctum are in place; the login/register/
   profile/order-history endpoints are not written.
4. **Server-side cart.** Tables exist; endpoints do not.
5. **Media library UI**, image upload pipeline, and moving off Unsplash URLs.
6. **Payments** (bKash/Nagad/SSLCommerz) — only COD exists.
7. **Roles & permissions** — the `role` column is there but not enforced beyond
   panel access.
8. **Tests.** None written yet.

## Security notes before going live

- Change the admin password and `APP_KEY`.
- Set `APP_DEBUG=false`.
- Configure CORS in `config/cors.php` to allow only your storefront domain.
- Put real credentials in `.env`, never in the repo.
