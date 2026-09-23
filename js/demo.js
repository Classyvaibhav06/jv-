/* ============================================================
   JK Vegies — DEMO MODE (js/demo.js)
   Runs the FULL site without Supabase: catalogue, cart, OTP
   sign-in, addresses, favourites, orders, admin & rider panels.
   Provides a Supabase-compatible client backed by localStorage.
   Activates automatically when no Supabase config exists.
   Reset: window.JKV_DemoReset()  (also a button on #/setup)
   ============================================================ */
(function () {
  'use strict';
  const DB_KEY = 'jkv_demo_db_v1';
  const uid = () => 'd' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  const now = () => new Date().toISOString();
  const hoursAgo = h => new Date(Date.now() - h * 3600e3).toISOString();

  /* ---- product photos: generated SVG data-URIs (no storage needed) ---- */
  function svgImg(emoji, c1, c2, label) {
    const s = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="400" height="400" rx="30" fill="url(#g)"/><circle cx="200" cy="170" r="120" fill="rgba(255,255,255,.38)"/><text x="200" y="230" font-size="150" text-anchor="middle">${emoji}</text><text x="200" y="356" font-size="32" font-family="Poppins,sans-serif" font-weight="700" fill="#4E342E" text-anchor="middle">${label}</text></svg>`;
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
  }

  /* ---- seed data ---- */
  const CATS = [
    { id: 'c_vn', name: 'Vegetables — Fresh Daily',   kind: 'vegetable', tag: 'normal',  sort_order: 1, is_active: true, image_url: svgImg('🥬', '#AED581', '#7CB342', 'Sabzi') },
    { id: 'c_vx', name: 'Exotic Vegetables',          kind: 'vegetable', tag: 'exotic',  sort_order: 2, is_active: true, image_url: svgImg('🥦', '#FFD54F', '#FFB300', 'Exotic') },
    { id: 'c_vo', name: 'Organic Vegetables',         kind: 'vegetable', tag: 'organic', sort_order: 3, is_active: true, image_url: svgImg('🌱', '#81C784', '#388E3C', 'Organic') },
    { id: 'c_fn', name: 'Fruits — Seasonal',          kind: 'fruit',     tag: 'normal',  sort_order: 4, is_active: true, image_url: svgImg('🍎', '#FF8A65', '#E64A19', 'Fal') },
    { id: 'c_fx', name: 'Exotic Fruits',              kind: 'fruit',     tag: 'exotic',  sort_order: 5, is_active: true, image_url: svgImg('🥝', '#FFE082', '#FF8F00', 'Exotic') },
    { id: 'c_fo', name: 'Organic Fruits',             kind: 'fruit',     tag: 'organic', sort_order: 6, is_active: true, image_url: svgImg('🌿', '#A5D6A7', '#2E7D32', 'Organic') },
  ];
  // [id, name, cat, price, discount, unit, emoji, label, desc]
  const P = (id, name, cat, price, disc, unit, emoji, label, desc) =>
    ({ id, name, category_id: cat, unit, price, discount_price: disc, image_url: svgImg(emoji, '#FFF3C4', '#FFD54F, ', label), is_active: true, description: desc, created_at: now() });
  const PRODUCTS = [
    // — vegetables, normal —
    { id: 'p01', name: 'Potato (Aloo)',            category_id: 'c_vn', unit: 'kg', price: 32, discount_price: 28, image_url: svgImg('🥔', '#FFE0B2', '#FF9800', 'Aloo'),        is_active: true, description: 'Firm, starchy — har sabzi ki jaan', created_at: now() },
    { id: 'p02', name: 'Tomato (Tamatar)',         category_id: 'c_vn', unit: 'kg', price: 44, discount_price: 38, image_url: svgImg('🍅', '#FFCDD2', '#E53935', 'Tamatar'),     is_active: true, description: 'Juicy, tangy, farm-fresh', created_at: now() },
    { id: 'p03', name: 'Onion (Pyaaz)',            category_id: 'c_vn', unit: 'kg', price: 40, discount_price: null, image_url: svgImg('🧅', '#F8BBD0', '#EC407A', 'Pyaaz'),     is_active: true, description: 'Sharp & fresh storage quality', created_at: now() },
    { id: 'p04', name: 'Spinach (Palak)',          category_id: 'c_vn', unit: 'kg', price: 36, discount_price: 30, image_url: svgImg('🥬', '#C5E1A5', '#558B2F', 'Palak'),       is_active: true, description: 'Tender leaves, washed twice', created_at: now() },
    { id: 'p05', name: 'Cauliflower (Phool Gobi)', category_id: 'c_vn', unit: 'kg', price: 55, discount_price: 48, image_url: svgImg('🥦', '#F5F5F5', '#BCAAA4', 'Gobi'),        is_active: true, description: 'Tight white curds', created_at: now() },
    { id: 'p06', name: 'Lady Finger (Bhindi)',     category_id: 'c_vn', unit: 'kg', price: 60, discount_price: null, image_url: svgImg('🥗', '#DCEDC8', '#7CB342', 'Bhindi'),    is_active: true, description: 'Crunchy, non-slimy', created_at: now() },
    { id: 'p07', name: 'Cucumber (Kheera)',        category_id: 'c_vn', unit: 'kg', price: 40, discount_price: 34, image_url: svgImg('🥒', '#B2EBF2', '#00897B', 'Kheera'),     is_active: true, description: 'Cooling, uniform size', created_at: now() },
    { id: 'p08', name: 'Carrot (Gajar)',           category_id: 'c_vn', unit: 'kg', price: 52, discount_price: 46, image_url: svgImg('🥕', '#FFCC80', '#EF6C00', 'Gajar'),      is_active: true, description: 'Sweet red desi gajar', created_at: now() },
    // — exotic vegetables —
    { id: 'p09', name: 'Broccoli',                 category_id: 'c_vx', unit: 'kg', price: 160, discount_price: 145, image_url: svgImg('🥦', '#DCEDC8', '#33691E', 'Broccoli'),  is_active: true, description: 'Imported-quality tight florets', created_at: now() },
    { id: 'p10', name: 'Zucchini',                 category_id: 'c_vx', unit: 'kg', price: 120, discount_price: null, image_url: svgImg('🥒', '#F0F4C3', '#9E9D24', 'Zucchini'), is_active: true, description: 'Mild, versatile squash', created_at: now() },
    { id: 'p11', name: 'Baby Corn',                category_id: 'c_vx', unit: 'kg', price: 130, discount_price: 115, image_url: svgImg('🌽', '#FFF9C4', '#FBC02D', 'Baby Corn'), is_active: true, description: 'Crisp miniature corn', created_at: now() },
    { id: 'p12', name: 'Coloured Bell Pepper',     category_id: 'c_vx', unit: 'kg', price: 220, discount_price: 199, image_url: svgImg('🫑', '#FFCDD2', '#D32F2F', 'Capsicum'),  is_active: true, description: 'Red, yellow & green trio', created_at: now() },
    { id: 'p13', name: 'Button Mushroom',          category_id: 'c_vx', unit: 'kg', price: 140, discount_price: 125, image_url: svgImg('🍄', '#EFEBE9', '#8D6E63', 'Mushroom'),  is_active: true, description: 'Fresh, hand-picked, no bruises', created_at: now() },
    { id: 'p14', name: 'Lettuce (Iceberg)',        category_id: 'c_vx', unit: 'kg', price: 95, discount_price: null, image_url: svgImg('🥬', '#E8F5E9', '#43A047', 'Lettuce'),  is_active: true, description: 'Crisp salad leaves', created_at: now() },
    // — organic vegetables —
    { id: 'p15', name: 'Organic Tomato',           category_id: 'c_vo', unit: 'kg', price: 70, discount_price: 62, image_url: svgImg('🍅', '#FFCDD2', '#B71C1C', 'Organic'),   is_active: true, description: 'Certified organic, zero sprays', created_at: now() },
    { id: 'p16', name: 'Organic Spinach',          category_id: 'c_vo', unit: 'kg', price: 55, discount_price: 48, image_url: svgImg('🌱', '#A5D6A7', '#1B5E20', 'Organic'),   is_active: true, description: 'Grown chemical-free', created_at: now() },
    { id: 'p17', name: 'Organic Carrot',           category_id: 'c_vo', unit: 'kg', price: 75, discount_price: null, image_url: svgImg('🥕', '#FFE0B2', '#E65100', 'Organic'),  is_active: true, description: 'Organic red gajar', created_at: now() },
    // — fruits, normal —
    { id: 'p18', name: 'Banana (Kela)',            category_id: 'c_fn', unit: 'kg', price: 55, discount_price: null, image_url: svgImg('🍌', '#FFF9C4', '#FDD835', 'Kela'),      is_active: true, description: 'Perfectly ripe bunch', created_at: now() },
    { id: 'p19', name: 'Apple (Kashmiri)',         category_id: 'c_fn', unit: 'kg', price: 180, discount_price: 165, image_url: svgImg('🍎', '#FFCDD2', '#C62828', 'Apple'),    is_active: true, description: 'Crisp, hand-picked', created_at: now() },
    { id: 'p20', name: 'Mango (Kesar)',            category_id: 'c_fn', unit: 'kg', price: 150, discount_price: 135, image_url: svgImg('🥭', '#FFE082', '#FF6F00', 'Kesar'),    is_active: true, description: 'Sweet, fragrant pulp', created_at: now() },
    { id: 'p21', name: 'Orange (Nagpur)',          category_id: 'c_fn', unit: 'kg', price: 80, discount_price: 72, image_url: svgImg('🍊', '#FFE0B2', '#EF6C00', 'Orange'),    is_active: true, description: 'Juicy, thin skin', created_at: now() },
    { id: 'p22', name: 'Papaya',                   category_id: 'c_fn', unit: 'kg', price: 45, discount_price: null, image_url: svgImg('🍈', '#FFECB3', '#FFA000', 'Papaya'),   is_active: true, description: 'Naturally ripened', created_at: now() },
    { id: 'p23', name: 'Watermelon (Tarbooz)',     category_id: 'c_fn', unit: 'piece', price: 45, discount_price: 40, image_url: svgImg('🍉', '#FFCDD2', '#AD1457', 'Tarbooz'), is_active: true, description: 'Sweet, seedless — whole melon', created_at: now() },
    { id: 'p24', name: 'Grapes (Angoor)',          category_id: 'c_fn', unit: 'kg', price: 90, discount_price: 80, image_url: svgImg('🍇', '#E1BEE7', '#6A1B9A', 'Angoor'),   is_active: true, description: 'Seedless, crisp', created_at: now() },
    // — exotic fruits —
    { id: 'p25', name: 'Kiwi',                     category_id: 'c_fx', unit: 'kg', price: 350, discount_price: 320, image_url: svgImg('🥝', '#F1F8E9', '#33691E', 'Kiwi'),     is_active: true, description: 'Golden-green, tangy', created_at: now() },
    { id: 'p26', name: 'Avocado',                  category_id: 'c_fx', unit: 'kg', price: 160, discount_price: 145, image_url: svgImg('🥑', '#F1F8E9', '#33691E', 'Avocado'),  is_active: true, description: 'Creamy, ready to eat', created_at: now() },
    { id: 'p27', name: 'Strawberry',               category_id: 'c_fx', unit: 'kg', price: 260, discount_price: 235, image_url: svgImg('🍓', '#FFCDD2', '#B71C1C', 'Berry'),    is_active: true, description: 'Bright red, farm-picked', created_at: now() },
    { id: 'p28', name: 'Blueberries',              category_id: 'c_fx', unit: 'kg', price: 480, discount_price: null, image_url: svgImg('🫐', '#C5CAE9', '#283593', 'Blueberry'), is_active: true, description: 'Antioxidant power', created_at: now() },
    // — organic fruits —
    { id: 'p29', name: 'Organic Banana',           category_id: 'c_fo', unit: 'kg', price: 75, discount_price: 68, image_url: svgImg('🌿', '#F0F4C3', '#558B2F', 'Organic'),   is_active: true, description: 'Organic, no wax', created_at: now() },
    { id: 'p30', name: 'Organic Apple',            category_id: 'c_fo', unit: 'kg', price: 240, discount_price: 220, image_url: svgImg('🍎', '#FFCDD2', '#880E4F', 'Organic'),  is_active: true, description: 'Organic Kashmiri', created_at: now() },
  ];

  const ADDR1 = { id: 'addr1', user_id: 'u_priya', label: 'Home', gali_no: 'Gali No. 7, House 221', full_address: 'Near Shiv Mandir, Rajouri Garden', landmark: 'Shiv Mandir', city: 'New Delhi', pincode: '110027', is_default: true, lat: 28.64, lng: 77.12, created_at: now() };
  const ORD1 = { id: 'ord_demo1', user_id: 'u_priya', rider_id: null, status: 'confirmed', subtotal: 86, delivery_fee: 29, total: 115, is_wholesale: false, delivery_otp: '135790',
    address_snapshot: { label: ADDR1.label, gali_no: ADDR1.gali_no, full_address: ADDR1.full_address, landmark: ADDR1.landmark, city: ADDR1.city, pincode: ADDR1.pincode, lat: ADDR1.lat, lng: ADDR1.lng }, created_at: now() };
  const ORD2 = { id: 'ord_demo2', user_id: 'u_priya', rider_id: 'u_rider', status: 'on_the_way', subtotal: 205, delivery_fee: 29, total: 234, is_wholesale: false, delivery_otp: '482913',
    address_snapshot: { label: ADDR1.label, gali_no: ADDR1.gali_no, full_address: ADDR1.full_address, landmark: ADDR1.landmark, city: ADDR1.city, pincode: ADDR1.pincode, lat: ADDR1.lat, lng: ADDR1.lng }, created_at: hoursAgo(1) };
  const OI = (order_id, product_id, product_name, qty_grams, price_per_kg) =>
    ({ order_id, product_id, product_name, qty_grams, price_per_kg, line_total: price_per_kg * qty_grams / 1000 });

  function seed() {
    return {
      profiles: [
        { id: 'u_admin',  email: 'admin@jkvegies.in',   full_name: 'Store Owner',  phone: '9811000001', role: 'admin',   created_at: hoursAgo(72) },
        { id: 'u_rider',  email: 'rider@jkvegies.in',   full_name: 'Ravi Kumar',   phone: '9876543210', role: 'rider',   created_at: hoursAgo(48) },
        { id: 'u_priya',  email: 'priya@example.in',    full_name: 'Priya Sharma', phone: '9123456780', role: 'customer', created_at: hoursAgo(24) },
      ],
      categories: CATS,
      products: PRODUCTS,
      addresses: [ADDR1],
      orders: [ORD1, ORD2],
      order_items: [
        OI('ord_demo1', 'p02', 'Tomato (Tamatar)', 1000, 38),
        OI('ord_demo1', 'p01', 'Potato (Aloo)', 1000, 28),
        OI('ord_demo1', 'p03', 'Onion (Pyaaz)', 500, 20),
        OI('ord_demo2', 'p09', 'Broccoli', 1000, 145),
        OI('ord_demo2', 'p10', 'Zucchini', 500, 60),
      ],
      notifications: [
        { id: 'n1', user_id: null,   title: '🥬 Fresh stock every morning', body: 'Farm pickup at 5 AM — order by 9 PM for next-morning delivery.', created_at: hoursAgo(2) },
        { id: 'n2', user_id: null,   title: '🚚 FREE delivery above ₹499',  body: 'Retail orders above ₹499 deliver free. Wholesale billed at special rates.', created_at: hoursAgo(5) },
        { id: 'n3', user_id: 'u_rider', title: '🛵 Demo delivery assigned', body: 'Order ord_demo2 (Broccoli + Zucchini) is on_the_way — open the Rider panel.', created_at: hoursAgo(1) },
      ],
      notification_reads: [], favourites: [], cart_items: [], rider_locations: [],
      files: {}, auth: null, lastOtp: null,
    };
  }

  let db;
  function load() {
    try { const r = JSON.parse(localStorage.getItem(DB_KEY)); if (r && Array.isArray(r.products) && r.products.length) return r; } catch {}
    const fresh = seed();
    try { localStorage.setItem(DB_KEY, JSON.stringify(fresh)); } catch {}
    return fresh;
  }
  function save() { try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch {} }
  db = load();
  // cross-tab: reload DB when another tab writes (admin ↔ rider ↔ customer)
  window.addEventListener('storage', e => { if (e.key === DB_KEY && e.newValue) { try { db = JSON.parse(e.newValue); } catch {} } });

  /* ---- profiles: auto-create on sign-in (like the SQL trigger) ---- */
  function ensureProfile(email) {
    let p = db.profiles.find(x => x.email === email);
    if (!p) {
      p = { id: uid(), email, full_name: email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        phone: null, role: email === 'admin@jkvegies.in' ? 'admin' : email === 'rider@jkvegies.in' ? 'rider' : 'customer',
        created_at: now() };
      db.profiles.push(p); save();
    }
    return p;
  }

  /* ---- tiny Supabase-compatible query builder ---- */
  function applyJoin(cols, row) {
    const out = { ...row };
    if (/categories\s*\(/.test(cols || '')) out.categories = db.categories.find(c => c.id === row.category_id) || null;
    if (/profiles\s*!/.test(cols || '')) out.profiles = db.profiles.find(p => p.id === row.user_id) || null;
    return out;
  }
  function builder(table) {
    const st = { op: 'select', cols: '*', filters: [], ord: null, lim: null, single: false, maybe: false, count: false, head: false, rows: null, patch: null, returning: false };
    function run() {
      return new Promise(resolve => {
        const T = () => db[table] || (db[table] = []);
        let rows, error = null, data = null, count = null;
        try {
          if (st.op === 'select') {
            rows = T().filter(r => st.filters.every(f => f(r)));
            if (st.ord) { const { c, asc } = st.ord; rows = rows.slice().sort((a, b) => (a[c] < b[c] ? -1 : a[c] > b[c] ? 1 : 0) * (asc ? 1 : -1)); }
            if (st.lim != null) rows = rows.slice(0, st.lim);
            if (st.count && st.head) { resolve({ count: rows.length, data: null, error: null }); return; }
            rows = rows.map(r => applyJoin(st.cols, r));
            count = rows.length;
            if (st.single) { data = rows[0] || null; if (!data) error = { message: 'JSON object requested, zero rows returned' }; }
            else if (st.maybe) data = rows[0] || null;
            else data = rows;
          } else if (st.op === 'insert' || st.op === 'upsert') {
            const list = st.rows || [];
            const made = list.map(r0 => {
              const r = { ...r0 };
              if (r.id == null) r.id = uid();
              if (r.created_at == null) r.created_at = now();
              if (table === 'orders') { r.status = r.status || 'pending'; r.rider_id = r.rider_id ?? null; }
              if (st.op === 'insert') T().push(r);
              else { const i = T().findIndex(x => x.id === r.id); if (i >= 0) T()[i] = r; else T().push(r); }
              return r;
            });
            save();
            data = st.returning ? (st.single ? made[0] : made) : null;
            if (st.single && !data) { data = made[0]; }
          } else if (st.op === 'update') {
            rows = T().filter(r => st.filters.every(f => f(r)));
            rows.forEach(r => Object.assign(r, st.patch));
            save();
            data = st.returning ? rows : null;
          } else if (st.op === 'delete') {
            const keep = T().filter(r => !st.filters.every(f => f(r)));
            const removed = T().length - keep.length;
            db[table] = keep; save();
            data = null; count = removed;
          }
        } catch (e) { error = { message: e.message }; }
        resolve({ data, error, count });
      });
    }
    const api = {
      select(cols = '*', opts) {
        if (st.op === 'insert' || st.op === 'update' || st.op === 'upsert') st.returning = true;
        else st.op = 'select';
        st.cols = cols;
        if (opts && opts.count === 'exact') { st.count = true; st.head = !!opts.head; }
        return api;
      },
      insert(rows) { st.op = 'insert'; st.rows = Array.isArray(rows) ? rows : [rows]; st.returning = false; return api; },
      upsert(rows) { st.op = 'upsert'; st.rows = Array.isArray(rows) ? rows : [rows]; return api; },
      update(patch) { st.op = 'update'; st.patch = patch; st.returning = false; return api; },
      delete() { st.op = 'delete'; return api; },
      eq(c, v) { st.filters.push(r => r[c] === v); return api; },
      neq(c, v) { st.filters.push(r => r[c] !== v); return api; },
      is(c, v) { st.filters.push(r => (r[c] ?? null) === (v ?? null)); return api; },
      or(expr) {
        const alts = expr.split(',').map(part => {
          const bits = part.split('.');
          const c = bits[0], op = bits[1], v = bits.slice(2).join('.') === 'null' ? null : bits.slice(2).join('.');
          if (op === 'is') return r => (r[c] ?? null) === v;
          if (op === 'eq') return r => r[c] === v;
          if (op === 'neq') return r => r[c] !== v;
          return () => false;
        });
        st.filters.push(r => alts.some(f => f(r)));
        return api;
      },
      order(c, opts) { st.ord = { c, asc: !(opts && (opts.ascending === false || opts.asc === false)) }; return api; },
      limit(n) { st.lim = n; return api; },
      single() { st.single = true; return api; },
      maybeSingle() { st.maybe = true; return api; },
      then(res, rej) { return run().then(res, rej); },
      catch(rej) { return run().catch(rej); },
    };
    return api;
  }

  /* ---- auth (OTP shown on screen instead of Gmail) ---- */
  const authCbs = [];
  function fireAuth(ev) {
    const sess = db.auth ? { user: { id: db.auth.id, email: db.auth.email } } : null;
    authCbs.forEach(cb => { try { cb(ev, { session: sess ? { user: sess.user } : null, user: sess }); } catch (e) { console.error(e); } });
  }
  const auth = {
    async getSession() { return { data: { session: db.auth ? { user: { id: db.auth.id, email: db.auth.email } } : null }, error: null }; },
    async signInWithOtp({ email }) {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email || '')) return { data: null, error: { message: 'Enter a valid email' } };
      const code = String(Math.floor(100000 + Math.random() * 900000));
      db.lastOtp = { email, code }; ensureProfile(email); save();
      client.__lastOtp = code;
      return { data: {}, error: null };
    },
    async verifyOtp({ email, token }) {
      if (!db.lastOtp || db.lastOtp.email !== email || db.lastOtp.code !== String(token)) return { data: null, error: { message: 'Invalid OTP — check the code shown on screen' } };
      const p = ensureProfile(email);
      db.auth = { email, id: p.id }; db.lastOtp = null; save(); client.__lastOtp = null;
      fireAuth('SIGNED_IN');
      return { data: { session: { user: { id: p.id, email } } }, error: null };
    },
    async signInWithPassword({ email, password }) {
      if (!email || !password) return { data: null, error: { message: 'Enter email and password' } };
      const p = ensureProfile(email);
      db.auth = { email, id: p.id }; save();
      fireAuth('SIGNED_IN');
      return { data: { session: { user: { id: p.id, email } } }, error: null };
    },
    async resetPasswordForEmail(email) {
      // demo: pretend the reset mail went out via Gmail
      return { data: {}, error: email ? null : { message: 'Enter email first' } };
    },
    async signOut() { db.auth = null; save(); fireAuth('SIGNED_OUT'); return { error: null }; },
    onAuthStateChange(cb) { authCbs.push(cb); return { data: { subscription: { unsubscribe() {} } } }; },
  };

  /* ---- storage (photo uploads → data-URL kept locally) ---- */
  const storage = {
    from(bucket) {
      return {
        async upload(path, file) {
          try {
            const dataUrl = await new Promise((res, rej) => {
              const fr = new FileReader();
              fr.onload = () => res(fr.result);
              fr.onerror = () => rej(new Error('Could not read file'));
              fr.readAsDataURL(file);
            });
            db.files[path] = dataUrl; save();
            return { data: { path }, error: null };
          } catch (e) { return { data: null, error: { message: e.message } }; }
        },
        getPublicUrl(path) { return { data: { publicUrl: db.files[path] || path } }; },
      };
    },
  };

  /* ---- realtime channels: no-op stand-ins ---- */
  function channel() {
    const c = { on() { return c; }, subscribe() { return c; }, unsubscribe() {}, then(r) { r && r(); return c; }, catch() { return c; } };
    return c;
  }

  const client = {
    __demo: true, __lastOtp: null,
    from: builder, auth, storage, channel,
  };

  window.JKV_Demo = {
    client: () => client,
    isDemo: true,
    reset() { try { localStorage.removeItem(DB_KEY); } catch {} location.reload(); },
  };
  window.JKV_DemoReset = window.JKV_Demo.reset;
})();
