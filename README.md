# JK Vegies 🥕🍅

**Fresh vegetables & fruits — retail for homes (kgs & grams), wholesale for restaurants.**

Single-file frontend: `index.html` (no build step, no framework, zero external deps).

## Catalog
- **Vegetables** — normal · exotic · organic
- **Fruits** — normal · exotic · organic
- Toggle **Retail / Wholesale** (restaurant rates, min 5 kg)

## Features
- 🛒 Cart with **automatic bill calculation** (grams/kg aware, savings, delivery fee)
- 🔔 **Notification centre** — new stock, order status, rider updates (real-time)
- ❤️ **Heart button** on every item + "My Hearts" page
- 🔍 Live search + category chips
- 👤 Profile + **Gmail OTP sign-in** (Supabase email OTP, demo mode without config)
- 📍 **Address optimizer** — type manually or auto-fetch full address (gali no., area, PIN) via GPS
- 🛡️ **Admin panel** (`#/admin`) — add items with photo → approve with rate/name/discounted price → manage orders (who ordered what, assign rider, change status, see OTP)
- 🏍️ **Rider panel** (`#/rider`) — accept job → mark picked → start delivery → **OTP handover**, with live map visible to customer + admin
- 🔐 OTP everywhere: sign-in, order confirmation, delivery handover

Login links are at the **end of the page** (footer bar).

## Demo credentials (change in `CONFIG` block of index.html)
- Admin passcode: `jkvegies@2026`
- Rider passcode: `rider@2026`

## Go live with Supabase
1. Create a Supabase project
2. Run `SUPABASE_SETUP.sql` in the SQL Editor
3. Enable **Email OTP** in Authentication → Providers
4. Fill in `CONFIG.SUPABASE_URL` and `CONFIG.SUPABASE_ANON_KEY` at the top of `index.html`
5. Push — done. Realtime orders/notifications light up automatically.

## Logo
Drop your logo at **`images/logo.png`** — the banner picks it up automatically (SVG fallback shows until then).

## Theme
Yellow + red mixture, rectangular buttons with slight curves, SVG icons on every button,
gov-website-style ticker & tables (for the lolz 😂), fully responsive.
