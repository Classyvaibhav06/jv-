# JK Vegies 🥕🍅

Fresh vegetables & fruits — retail for homes (kgs & grams), wholesale for restaurants.
Supabase-backed static SPA (no build step).

**Quick start → see [SETUP.md](SETUP.md)** (hosting, Supabase SQL, Gmail OTP, admin & rider roles).

- `index.html` — app shell (banner, search, drawers, footer)
- `css/styles.css` — yellow-red theme, SVG buttons, 20% banner, responsive
- `js/config.js` — Supabase URL + anon key (or set in-app via footer → Supabase Setup)
- `js/app.js` — all logic: catalogue, cart, OTP auth, addresses, checkout, live tracking, admin & rider panels
- `sql/schema.sql` — run once in Supabase (tables, RLS, roles, realtime, storage buckets)
- `images/` — drop your `logo.png` here

Verified: 36/36 automated E2E checks (jsdom + in-memory Supabase mock) covering
catalogue/search/cart math/Gmail-OTP sign-in/addresses/checkout+OTP/admin portal/rider OTP handover/notifications.
