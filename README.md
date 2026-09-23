# QuickMart

Blinkit-style quick-commerce frontend in one self-contained HTML file — customer, admin and rider portals sharing one localStorage-backed store.

## Run

Open `index.html` in any browser, or serve the folder: `python3 -m http.server 8000`

## Portals

**Customer** — `#/` home · `#/search` search · `#/c/<category>` category · `#/cart` cart · `#/checkout` checkout · `#/orders` history · `#/order/<id>` live tracking

**Admin** — `#/admin` overview (demo login, any credentials) · `#/admin/orders` status management · `#/admin/inventory` editable stock · `#/admin/customers` · `#/admin/riders`

**Rider** — `#/rider` active jobs · `#/rider/jobs` history · `#/rider/job/<id>` route + OTP + status flow · `#/rider/earnings` · `#/rider/profile`

Demo coupons: `SAVE50` (₹50 off above ₹300), `FIRST20` (20% off above ₹200, max ₹100).
