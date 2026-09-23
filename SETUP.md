# JK Vegies — Website Source

Ready-to-host static website. All data lives in **your Supabase project** — no fake content anywhere.

## Files
- `index.html` — the whole store (single-page app)
- `css/styles.css` — yellow-red theme
- `js/config.js` — Supabase URL + anon key (or set them in-app via footer → Supabase Setup)
- `js/app.js` — all logic
- `images/` — **drop your `logo.png` here** (shown top-left in the banner; a fallback icon shows until then)
- `sql/schema.sql` — run once in Supabase

## Go-live in 10 minutes
1. **Host it** — drag this folder onto Netlify Drop / Vercel / GitHub Pages / any static host. Or serve locally: `python3 -m http.server`.
2. **Supabase** → SQL Editor → run `sql/schema.sql` once.
3. Open the site → footer → **Supabase Setup** → paste Project URL + anon key → Save & Connect.
4. **Supabase → Authentication → Sign In → enable Email OTP.**
5. **Supabase → Project Settings → Auth → SMTP** → add your Gmail (`smtp.gmail.com:587`, your Gmail + an App Password) so OTP mails come from your Gmail.
6. Sign in on the site with OTP, then in Supabase SQL run:
   `update profiles set role='admin' where email='you@example.com';`
7. Footer → **Admin Login** → Dashboard → add Categories (Vegetables/Fruits × Normal/Exotic/Organic with photos), then Products with rate + discounted price. Done — the store is live.

## Roles
- **Customer** — sign in with email OTP, shop, favourites, addresses, live order tracking.
- **Rider** — signs in with OTP once → owner sets role to `rider` in Admin → Riders → rider sets password via Rider Login → “forgot password” → uses Rider panel (GPS broadcast, OTP handover).
- **Admin** — footer → Admin Login (email + password).

## Notes
- Cart works for guests (saved in browser) and syncs to Supabase on sign-in.
- Address auto-fetch uses phone GPS + free reverse-geocoding; the customer still types/confirms gali number.
- Delivery is pay-on-delivery; the 6-digit OTP is generated per order and shown to the customer — the rider must enter it to complete delivery.
- Free delivery above ₹499, otherwise ₹29 (change `fee` in `js/app.js` checkout route to adjust).


## 🏃 Demo mode (works with zero setup)

Open the site and it just runs — catalogue, cart, OTP sign-in, favourites, addresses,
orders, **admin panel** and **rider panel** all work on demo data stored in your
browser (localStorage). No Supabase account needed.

- **OTP shows on screen** (toast) instead of a Gmail email.
- **Admin login:** `admin@jkvegies.in` → footer → Admin Login (any password also accepted there).
- **Rider login:** `rider@jkvegies.in` → footer → Rider Login.
- **Seeded:** 30 products across 6 categories (veg/fruit × normal/exotic/organic),
  2 sample orders (one `confirmed`, one `on_the_way` for the demo rider), broadcasts,
  a demo customer (Priya Sharma) and delivery OTPs (`482913` on the active order).
- Demo changes persist per-browser. Reset anytime: `#/setup` → **Reset demo data**,
  or run `JKV_DemoReset()` in the browser console.

**Going live:** paste your Supabase URL + anon key on the **Supabase Setup** page —
the site switches to live data immediately (demo data stays untouched in your browser).
