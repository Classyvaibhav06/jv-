/* ============================================================
   JK VEGIES — app.js (static SPA + Supabase backend-as-a-service)
   All data lives in the owner's Supabase project. No fake data.
   ============================================================ */
'use strict';
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = n => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

/* ---------------- SVG icon set (every button uses these) ---------------- */
const ICONS = {
  bell:'<path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5a6 6 0 0 0-4.5-5.8V4.5a1.5 1.5 0 0 0-3 0v.7A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2z"/>',
  cart:'<path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>',
  user:'<path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-3.34 0-10 1.67-10 5v3h20v-3c0-3.33-6.66-5-10-5z"/>',
  heart:'<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>',
  search:'<path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/>',
  x:'<path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>',
  plus:'<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>',
  minus:'<path d="M19 13H5v-2h14v2z"/>',
  check:'<path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>',
  pin:'<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/>',
  truck:'<path d="M20 8h-3V4H3a1 1 0 0 0-1 1v11h2a3 3 0 0 0 3 3 3 3 0 0 0 3-3h6a3 3 0 0 0 3 3 3 3 0 0 0 3-3h2v-5l-4-4zM8 18.5A1.5 1.5 0 1 1 9.5 17 1.5 1.5 0 0 1 8 18.5zm11 0a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5zM17 12V9.5h2.5l1.96 2.5H17z"/>',
  box:'<path d="M21 8.5 12.5 3 3 8.5v7L12.5 21 21 15.5v-7zM12 4.7l6.6 4.1L12 12.9 5.4 8.8 12 4.7zM4.5 10.2l7 4.37v7.25l-7-4.37v-7.25zm9 11.62v-7.25l7-4.37v7.25l-7 4.37z"/>',
  edit:'<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>',
  trash:'<path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>',
  logout:'<path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8v-2H4V5z"/>',
  upload:'<path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/>',
  home:'<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>',
  leaf:'<path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 5z"/>',
  star:'<path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>',
  clock:'<path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7z"/>',
  shield:'<path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>',
  key:'<path d="M12.65 10A6 6 0 1 0 8 12.9V14h2v2h2v2h4v-4.35c-.5-.6-1.2-1.28-2.35-1.65zM8 12a4 4 0 1 1 4 4h-2v-2H8v-2z"/>',
  bike:'<path d="M15.5 5.5a2.5 2.5 0 1 0 2.5 2.5 2.5 2.5 0 0 0-2.5-2.5zM5 12a5 5 0 1 0 3.1-8.87A5 5 0 0 0 5 12zm0 2a7 7 0 1 1 4.9 12H7v-2h1.5A5 5 0 0 0 5 14zm14 0a7 7 0 1 1-9.9-6.36l1.42 1.42A5 5 0 1 0 19 14h-3v2h5v-2z"/>',
  store:'<path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/>',
  wallet:'<path d="M21 7H5a1 1 0 0 1 0-2h14V3H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1zm-4 7a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 17 14z"/>',
  send:'<path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"/>',
  refresh:'<path d="M17.65 6.35A8 8 0 1 0 19.73 14h-2.08a6 6 0 1 1-1.41-6.24L13 11h7V4l-2.35 2.35z"/>',
};
const icon = n => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* ---------------- toast ---------------- */
function toast(msg, ic = 'check') {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `${icon(ic)}<span>${esc(msg)}</span>`;
  $('#toastWrap').appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 320); }, 2600);
}

/* ---------------- Supabase client ---------------- */
let sb = null;
function sbConfigured() {
  const c = window.JKV_CONFIG || {};
  return !!(c.SUPABASE_URL && c.SUPABASE_ANON_KEY && c.SUPABASE_URL.startsWith('http'));
}
function initSupabase() {
  if (sbConfigured()) {
    if (!sb || sb.__demo) sb = window.supabase.createClient(window.JKV_CONFIG.SUPABASE_URL, window.JKV_CONFIG.SUPABASE_ANON_KEY);
    return true;
  }
  if (window.JKV_Demo) { if (!sb) sb = window.JKV_Demo.client(); return true; }   // demo mode: full site, no Supabase
  sb = null; return false;
}
function needSb() {
  if (!initSupabase()) { location.hash = '#/setup'; toast('Connect Supabase first', 'key'); return false; }
  return true;
}

/* ---------------- global state ---------------- */
const S = {
  user: null, profile: null,
  products: [], categories: [],
  cart: [],            // [{id, qty}] qty = grams (kg items) or pieces
  fav: new Set(),
  addresses: [], notifs: [], readIds: new Set(),
  activeCat: 'all', q: '',
  riders: [],
};
const priceOf = p => (p.discount_price != null ? Number(p.discount_price) : Number(p.price));
const isPiece = p => p.unit === 'piece';
const QTY_OPTS = p => isPiece(p) ? [1,2,3,5,10,20] : [250,500,1000,2000,5000];
const fmtQty = (p, q) => isPiece(p) ? `${q} pc` : (q >= 1000 ? `${q/1000} kg` : `${q} g`);
const lineTotal = (p, q) => isPiece(p) ? priceOf(p) * q : priceOf(p) * q / 1000;
const prodById = id => S.products.find(p => p.id === id);

/* ---------------- cart (localStorage for guests, Supabase when logged in) ---------------- */
function loadLocalCart() {
  try { S.cart = JSON.parse(localStorage.getItem('jkv_cart') || '[]'); } catch { S.cart = []; }
}
function saveLocalCart() { localStorage.setItem('jkv_cart', JSON.stringify(S.cart)); }
function cartEntry(id) { return S.cart.find(c => c.id === id); }
function setQty(id, qty) {
  const e = cartEntry(id);
  if (qty <= 0) S.cart = S.cart.filter(c => c.id !== id);
  else if (e) e.qty = qty; else S.cart.push({ id, qty });
  saveLocalCart(); syncCartDb(); renderBadges(); renderCartDrawer();
  if ((location.hash || '#/') === '#/') renderGrid();
}
function cartCount() { return S.cart.length; }
function cartTotals() {
  let mrp = 0, total = 0;
  for (const c of S.cart) {
    const p = prodById(c.id); if (!p) continue;
    const qtyFactor = isPiece(p) ? c.qty : c.qty / 1000;
    mrp += Number(p.price) * qtyFactor;
    total += lineTotal(p, c.qty);
  }
  return { mrp, total, save: mrp - total };
}
let _cartSyncT = null;
async function syncCartDb() {
  if (!S.user || !sb) return;
  clearTimeout(_cartSyncT);
  _cartSyncT = setTimeout(async () => {
    await sb.from('cart_items').delete().eq('user_id', S.user.id);
    if (S.cart.length) await sb.from('cart_items').insert(S.cart.map(c => ({ user_id: S.user.id, product_id: c.id, qty_grams: c.qty })));
  }, 600);
}
async function pullCartDb() {
  if (!S.user || !sb) return;
  const { data } = await sb.from('cart_items').select('product_id,qty_grams').eq('user_id', S.user.id);
  const db = (data || []).map(r => ({ id: r.product_id, qty: r.qty_grams }));
  const merged = [...S.cart];
  for (const d of db) if (!merged.find(m => m.id === d.id)) merged.push(d);
  S.cart = merged; saveLocalCart();
}

/* ---------------- session ---------------- */
async function refreshSession() {
  if (!initSupabase()) return;
  const { data: { session } } = await sb.auth.getSession();
  S.user = session?.user || null;
  if (S.user) {
    const { data } = await sb.from('profiles').select('*').eq('id', S.user.id).single();
    S.profile = data || null;
    await pullCartDb();
    await loadFavs(); await loadAddresses(); await loadNotifs(); await loadReads();
    subscribeNotifs();
  } else { S.profile = null; }
  renderBadges();
}
async function signOut() {
  if (sb) await sb.auth.signOut();
  S.user = null; S.profile = null; S.fav = new Set(); S.addresses = []; S.notifs = [];
  toast('Signed out', 'logout'); location.hash = '#/';
}

/* ---------------- catalogue data ---------------- */
async function loadCatalog() {
  if (!initSupabase()) { S.categories = []; S.products = []; return; }
  const [{ data: cats }, { data: prods }] = await Promise.all([
    sb.from('categories').select('*').eq('is_active', true).order('sort_order'),
    sb.from('products').select('*').eq('is_active', true).order('name'),
  ]);
  S.categories = cats || []; S.products = prods || [];
}
async function loadFavs() {
  if (!S.user || !sb) return;
  const { data } = await sb.from('favourites').select('product_id').eq('user_id', S.user.id);
  S.fav = new Set((data || []).map(r => r.product_id));
}
async function toggleFav(id) {
  if (!S.user) { toast('Sign in to save favourites', 'heart'); location.hash = '#/auth'; return; }
  if (!needSb()) return;
  if (S.fav.has(id)) { S.fav.delete(id); await sb.from('favourites').delete().eq('user_id', S.user.id).eq('product_id', id); }
  else { S.fav.add(id); await sb.from('favourites').insert({ user_id: S.user.id, product_id: id }); toast('Added to favourites', 'heart'); }
  renderGrid(); if ((location.hash || '') === '#/favourites') renderFavourites();
}
async function loadAddresses() {
  if (!S.user || !sb) return;
  const { data } = await sb.from('addresses').select('*').eq('user_id', S.user.id).order('is_default', { ascending: false });
  S.addresses = data || [];
}

/* ---------------- notifications ---------------- */
async function loadNotifs() {
  if (!sb) return;
  let q = sb.from('notifications').select('*').order('created_at', { ascending: false }).limit(30);
  q = S.user ? q.or(`user_id.is.null,user_id.eq.${S.user.id}`) : q.is('user_id', null);
  const { data } = await q; S.notifs = data || [];
}
async function loadReads() {
  if (!S.user || !sb) return;
  const { data } = await sb.from('notification_reads').select('notification_id').eq('user_id', S.user.id);
  S.readIds = new Set((data || []).map(r => r.notification_id));
}
let _notifCh = null;
function subscribeNotifs() {
  if (!sb || _notifCh) return;
  _notifCh = sb.channel('jkv-notifs')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, async payload => {
      const n = payload.new;
      if (!n.user_id || (S.user && n.user_id === S.user.id)) {
        S.notifs.unshift(n); renderBadges(); renderNotifDrawer();
        toast(n.title, 'bell');
      }
    }).subscribe();
}
function unreadCount() { return S.notifs.filter(n => !S.readIds.has(n.id)).length; }
async function markNotifRead(id) {
  if (!S.user || !sb || S.readIds.has(id)) return;
  S.readIds.add(id);
  await sb.from('notification_reads').insert({ notification_id: id, user_id: S.user.id });
  renderBadges(); renderNotifDrawer();
}

/* ---------------- header badges / drawers ---------------- */
function renderBadges() {
  const cb = $('#cartBadge'), nb = $('#notifBadge');
  const cc = cartCount(), uc = unreadCount();
  cb.hidden = cc === 0; cb.textContent = cc;
  nb.hidden = uc === 0; nb.textContent = uc > 9 ? '9+' : uc;
}
function openDrawer(which) {
  $('#drawerScrim').hidden = false;
  $('#notifDrawer').hidden = which !== 'notif';
  $('#cartDrawer').hidden = which !== 'cart';
  if (which === 'notif') renderNotifDrawer();
  if (which === 'cart') renderCartDrawer();
}
function closeDrawers() {
  $('#drawerScrim').hidden = true;
  $('#notifDrawer').hidden = true; $('#cartDrawer').hidden = true;
}
function renderNotifDrawer() {
  const el = $('#notifList');
  if (!S.notifs.length) { el.innerHTML = `<div class="empty">${icon('bell')}<h3>No notifications yet</h3><p>New sabzi arrivals & offers will pop up here.</p></div>`; return; }
  el.innerHTML = S.notifs.map(n => `
    <div class="notif-card ${S.readIds.has(n.id) ? '' : 'unread'}" data-nid="${n.id}">
      <h4>${esc(n.title)}</h4><p>${esc(n.body)}</p>
      <time>${new Date(n.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</time>
    </div>`).join('');
  el.querySelectorAll('.notif-card').forEach(c => c.onclick = () => markNotifRead(c.dataset.nid));
}
function renderCartDrawer() {
  const list = $('#cartList'), foot = $('#cartFoot');
  if (!S.cart.length) {
    list.innerHTML = `<div class="empty">${icon('cart')}<h3>Cart is empty</h3><p>Fresh sabzi is waiting — add something taaza!</p></div>`;
    foot.innerHTML = `<button class="btn block" data-close-drawer>Browse Vegetables</button>`;
    return;
  }
  list.innerHTML = S.cart.map(c => {
    const p = prodById(c.id); if (!p) return '';
    return `<div class="cart-line">
      <img src="${esc(p.image_url || '')}" alt="" onerror="this.style.visibility='hidden'">
      <div class="cl-info"><div class="cl-name">${esc(p.name)}</div>
        <div class="cl-sub">${fmtQty(p, c.qty)} × ${money(priceOf(p))}${isPiece(p) ? '/pc' : '/kg'}</div></div>
      <div class="qty-ctrl">
        <button class="icon-btn sm" data-dec="${p.id}" aria-label="Decrease">${icon('minus')}</button>
        <span class="qty-val">${fmtQty(p, c.qty)}</span>
        <button class="icon-btn sm" data-inc="${p.id}" aria-label="Increase">${icon('plus')}</button>
      </div>
      <button class="icon-btn sm red" data-rm="${p.id}" aria-label="Remove">${icon('trash')}</button>
    </div>`;
  }).join('');
  const t = cartTotals();
  foot.innerHTML = `
    <div class="totals-row"><span>MRP total</span><span>${money(t.mrp)}</span></div>
    <div class="totals-row"><span>You save</span><span style="color:var(--green);font-weight:700">− ${money(t.save)}</span></div>
    <div class="totals-row grand"><span>To pay</span><span>${money(t.total)}</span></div>
    <button class="btn block" id="goCheckout" style="margin-top:10px">${icon('wallet')} Checkout</button>`;
  $('#goCheckout').onclick = () => { closeDrawers(); location.hash = '#/checkout'; };
  list.querySelectorAll('[data-dec]').forEach(b => b.onclick = () => stepQty(b.dataset.dec, -1));
  list.querySelectorAll('[data-inc]').forEach(b => b.onclick = () => stepQty(b.dataset.inc, 1));
  list.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => setQty(b.dataset.rm, 0));
}
function stepQty(id, dir) {
  const p = prodById(id); if (!p) return;
  const opts = QTY_OPTS(p), cur = cartEntry(id)?.qty || 0;
  let i = opts.indexOf(cur); if (i < 0) i = dir > 0 ? 0 : opts.length - 1;
  const ni = Math.min(opts.length - 1, Math.max(0, i + dir));
  setQty(id, opts[ni]);
}

/* ---------------- HOME: chips + catalogue ---------------- */
function catLabel(c) { return `${c.kind === 'fruit' ? 'Fruits' : 'Vegetables'} • ${c.tag[0].toUpperCase() + c.tag.slice(1)}`; }
function renderChips() {
  const bar = $('#chipBar');
  const chips = [{ id: 'all', name: 'All', ic: 'store' },
    ...S.categories.map(c => ({ id: c.id, name: c.name, img: c.image_url }))];
  bar.innerHTML = chips.map(ch =>
    `<button class="chip ${S.activeCat === ch.id ? 'active' : ''}" data-cat="${ch.id}" role="tab">
       ${ch.img ? `<img src="${esc(ch.img)}" alt="" onerror="this.remove()">` : icon(ch.ic || 'leaf')}
       ${esc(ch.name)}</button>`).join('');
  bar.querySelectorAll('.chip').forEach(b => b.onclick = () => { S.activeCat = b.dataset.cat; renderChips(); renderGrid(); });
}
function filteredProducts(catId) {
  const q = S.q.trim().toLowerCase();
  return S.products.filter(p =>
    (catId === 'all' || p.category_id === catId) &&
    (!q || (p.name + ' ' + (p.description || '')).toLowerCase().includes(q)));
}
function productCard(p) {
  const e = cartEntry(p.id), loved = S.fav.has(p.id);
  const cat = S.categories.find(c => c.id === p.category_id);
  const tagCls = cat ? (cat.tag === 'exotic' ? 'exotic' : cat.tag === 'organic' ? 'organic' : '') : '';
  const tagTxt = cat ? catLabel(cat).split('•')[1]?.trim() || '' : '';
  const off = p.discount_price != null && Number(p.discount_price) < Number(p.price)
    ? Math.round((1 - p.discount_price / p.price) * 100) : 0;
  const opts = QTY_OPTS(p), sel = e?.qty || opts[1] || opts[0];
  return `<article class="pcard" data-pid="${p.id}">
    <div class="pimg">
      ${p.image_url ? `<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy" onerror="this.remove()">` : ''}
      ${tagTxt ? `<span class="tag ${tagCls}">${esc(tagTxt)}</span>` : ''}
      ${off ? `<span class="off">${off}% OFF</span>` : ''}
      <button class="icon-btn sm heart ${loved ? 'loved' : ''}" data-heart="${p.id}" aria-label="Favourite">${icon('heart')}</button>
    </div>
    <div class="pbody">
      <div class="pname">${esc(p.name)}</div>
      <div class="punit">per ${isPiece(p) ? 'piece' : 'kg'}</div>
      <div class="price-row"><span class="price">${money(priceOf(p))}${isPiece(p) ? '' : '/kg'}</span>
        ${off ? `<span class="mrp">${money(p.price)}</span>` : ''}</div>
      <div class="qty-row">
        <div class="qty-ctrl">
          <button class="icon-btn sm" data-cdec="${p.id}" aria-label="Less">${icon('minus')}</button>
          <span class="qty-val"><select data-qsel="${p.id}">${opts.map(o => `<option value="${o}" ${o === sel ? 'selected' : ''}>${fmtQty(p, o)}</option>`).join('')}</select></span>
          <button class="icon-btn sm" data-cinc="${p.id}" aria-label="More">${icon('plus')}</button>
        </div>
        <button class="btn add-btn ${e ? 'yellow' : ''}" data-add="${p.id}">${icon('cart')} ${e ? 'Update' : 'Add'}</button>
      </div>
      ${e ? `<div class="line-total">= ${money(lineTotal(p, e.qty))}</div>` : ''}
    </div></article>`;
}
function renderGrid() {
  const v = $('#view'); if (!v) return;
  const demoNote = sbConfigured() ? '' : `<div class="setup-note" style="border-color:var(--yellow-deep);margin-bottom:14px">🏃 <b>Demo mode</b> — sample catalogue &amp; data running from your browser (no Supabase yet). OTP shows on screen; role logins: <b>admin@jkvegies.in</b> / <b>rider@jkvegies.in</b>. <a href="#/setup">Connect Supabase</a> when ready to go live.</div>`;
  const showCats = S.activeCat === 'all' ? S.categories : S.categories.filter(c => c.id === S.activeCat);
  let html = '';
  if (!S.categories.length && !S.products.length) {
    html = `<div class="empty">${icon('store')}<h3>Catalogue is empty</h3>
      <p>The owner hasn't added any vegetables or fruits yet. Real items appear here as soon as the admin adds them — nothing fake, ever.</p></div>`;
  } else {
    for (const c of showCats) {
      const items = filteredProducts(c.id);
      if (!items.length) continue;
      html += `<div class="section-head"><h2>${icon('leaf')} ${esc(c.name)}</h2><span class="pill" style="background:var(--yellow-deep);color:#4E342E">${items.length} items</span></div>
        <p class="slogan-line">${c.kind === 'fruit' ? 'Meethe, ras bhare, taaza phal — roz!' : 'Khet se seedha, bina bichauliye!'}</p>
        <div class="grid">${items.map(productCard).join('')}</div>`;
    }
    if (S.activeCat === 'all') {
      const loose = S.products.filter(p => !p.category_id && (!S.q || (p.name + ' ' + (p.description || '')).toLowerCase().includes(S.q.trim().toLowerCase())));
      if (loose.length) html += `<div class="section-head"><h2>${icon('box')} More Fresh Picks</h2></div><div class="grid">${loose.map(productCard).join('')}</div>`;
    }
    if (!html) html = `<div class="empty">${icon('search')}<h3>No matches for “${esc(S.q)}”</h3><p>Try another sabzi or fruit name.</p></div>`;
  }
  v.innerHTML = demoNote + html;
}
function bindGridEvents() {
  const v = $('#view');
  v.onclick = e => {
    const t = e.target.closest('[data-add],[data-heart],[data-cdec],[data-cinc]');
    if (!t) return;
    if (t.dataset.add) { const p = prodById(t.dataset.add); const sel = v.querySelector(`[data-qsel="${p.id}"]`); setQty(p.id, Number(sel.value)); toast(`${p.name} in cart`, 'cart'); }
    else if (t.dataset.heart) toggleFav(t.dataset.heart);
    else if (t.dataset.cdec || t.dataset.cinc) {
      const id = t.dataset.cdec || t.dataset.cinc, p = prodById(id);
      const sel = v.querySelector(`[data-qsel="${id}"]`), opts = QTY_OPTS(p);
      let i = opts.indexOf(Number(sel.value)); i = Math.min(opts.length - 1, Math.max(0, i + (t.dataset.cinc ? 1 : -1)));
      sel.value = opts[i];
      if (cartEntry(id)) setQty(id, opts[i]);
    }
  };
}

/* ---------------- ROUTER ---------------- */
const routes = {};
function route(path, fn) { routes[path] = fn; }
async function router() {
  closeDrawers();
  const raw = (location.hash || '#/').slice(1).split('?')[0];
  const [path, param] = raw.split('/').filter(Boolean).length >= 2 && raw.startsWith('/order/')
    ? ['/order', raw.split('/')[2]] : [raw === '' ? '/' : raw, null];
  window.scrollTo(0, 0);
  const showSearch = path === '/' || path === '';
  $('#searchBar').style.display = showSearch ? '' : 'none';
  $('#chipBar').style.display = showSearch ? '' : 'none';
  const fn = routes[path] || routes['/404'];
  try { await fn(param); } catch (err) { console.error(err); $('#view').innerHTML = `<div class="empty">${icon('x')}<h3>Something went wrong</h3><p>${esc(err.message)}</p></div>`; }
}

/* ---------------- boot ---------------- */
function bindShell() {
  $('#notifBtn').onclick = () => openDrawer('notif');
  $('#cartBtn').onclick = () => openDrawer('cart');
  $('#profileBtn').onclick = () => location.hash = S.user ? '#/profile' : '#/auth';
  $('#drawerScrim').onclick = closeDrawers;
  document.addEventListener('click', e => { if (e.target.closest('[data-close-drawer]')) closeDrawers(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawers(); });
  const si = $('#searchInput');
  si.addEventListener('input', () => {
    S.q = si.value; $('#searchClear').hidden = !si.value;
    if ((location.hash || '#/') !== '#/') location.hash = '#/';
    else renderGrid();
  });
  $('#searchClear').onclick = () => { si.value = ''; S.q = ''; $('#searchClear').hidden = true; renderGrid(); };
  bindGridEvents();
}
window.addEventListener('hashchange', router);
document.addEventListener('DOMContentLoaded', async () => {
  loadLocalCart();
  bindShell();
  initSupabase();
  await refreshSession();
  await loadCatalog();
  renderChips(); renderBadges();
  await router();
  if (sb) sb.auth.onAuthStateChange(async (ev) => {
    if (ev === 'SIGNED_IN' || ev === 'SIGNED_OUT' || ev === 'TOKEN_REFRESHED') { await refreshSession(); await loadCatalog(); renderChips(); router(); }
  });
});

/* ================= CUSTOMER: AUTH (email OTP via Gmail SMTP) ================= */
route('/auth', async () => {
  const v = $('#view');
  if (S.user) { location.hash = '#/profile'; return; }
  v.innerHTML = `<div class="form-card"><h2>${icon('key')} Sign In</h2>
    <p class="sub">We send a 6-digit OTP to your email (via Gmail). No passwords to remember!</p>
    <div id="otpStep1">
      <div class="field"><label>Email address</label>
        <input id="authEmail" type="email" placeholder="you@example.com"></div>
      <button class="btn block" id="sendOtp">${icon('send')} Send OTP</button>
    </div>
    <div id="otpStep2" hidden>
      <div class="field"><label>Enter the 6-digit OTP sent to <b id="otpEmailEcho"></b></label>
        <input id="otpCode" inputmode="numeric" maxlength="6" placeholder="••••••" style="letter-spacing:6px;text-align:center;font-size:22px;font-weight:700"></div>
      <button class="btn block" id="verifyOtp">${icon('check')} Verify & Sign In</button>
      <button class="btn ghost block" id="resendOtp" style="margin-top:8px">Resend OTP</button>
    </div>
    <p class="hint" style="margin-top:12px;font-size:12.5px;color:var(--muted)">Admins & riders: use the <a href="#/admin">Admin Login</a> / <a href="#/rider">Rider Login</a> links in the footer.</p>
    ${sbConfigured() ? '' : `<p class="hint" style="margin-top:6px;font-size:12.5px;color:var(--red)">🏃 Demo: OTP appears on screen. Role logins — admin: <b>admin@jkvegies.in</b>, rider: <b>rider@jkvegies.in</b></p>`}
  </div>`;
  const email = () => $('#authEmail').value.trim();
  $('#sendOtp').onclick = async () => {
    if (!needSb()) return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email())) { toast('Enter a valid email', 'x'); return; }
    const btn = $('#sendOtp'); btn.disabled = true; btn.textContent = 'Sending…';
    const { error } = await sb.auth.signInWithOtp({ email: email(), options: { shouldCreateUser: true } });
    btn.disabled = false; btn.innerHTML = `${icon('send')} Send OTP`;
    if (error) { toast(error.message, 'x'); return; }
    $('#otpStep1').hidden = true; $('#otpStep2').hidden = false;
    $('#otpEmailEcho').textContent = email();
    toast(sb && sb.__demo && sb.__lastOtp ? `Demo OTP: ${sb.__lastOtp} (no email sent — code is on screen)` : 'OTP sent — check your email', 'send');
  };
  $('#verifyOtp').onclick = async () => {
    const code = $('#otpCode').value.trim();
    if (code.length !== 6) { toast('Enter the 6-digit OTP', 'x'); return; }
    const { error } = await sb.auth.verifyOtp({ email: email(), token: code, type: 'email' });
    if (error) { toast(error.message, 'x'); return; }
    toast('Welcome to JK Vegies!', 'check');
    location.hash = '#/';
  };
  $('#resendOtp').onclick = () => $('#sendOtp').click();
});

/* ================= CUSTOMER: PROFILE ================= */
route('/profile', async () => {
  const v = $('#view');
  if (!S.user) { location.hash = '#/auth'; return; }
  if (!needSb()) return;
  await loadAddresses();
  if (!S.user) { location.hash = '#/auth'; return; }   // guard: signed out while loading
  const p = S.profile || {};
  v.innerHTML = `<div class="form-card"><h2>${icon('user')} My Profile</h2>
    <p class="sub">${esc(S.user.email || '')} • ${esc(p.role || 'customer')}</p>
    <div class="row2">
      <div class="field"><label>Full name</label><input id="pfName" value="${esc(p.full_name || '')}" placeholder="Your name"></div>
      <div class="field"><label>Phone</label><input id="pfPhone" value="${esc(p.phone || '')}" placeholder="98XXXXXXXX"></div>
    </div>
    <button class="btn" id="pfSave">${icon('check')} Save Details</button>
    <div class="section-head" style="margin-top:22px"><h2>${icon('pin')} My Addresses</h2></div>
    <div id="addrList"></div>
    <button class="btn yellow" id="addrAdd" style="margin-top:8px">${icon('plus')} Add Address</button>
    <div id="addrForm"></div>
    <div style="display:flex;gap:10px;margin-top:22px;flex-wrap:wrap">
      <a class="btn ghost" href="#/orders">${icon('box')} My Orders</a>
      <a class="btn ghost" href="#/favourites">${icon('heart')} Favourites</a>
      <button class="btn" id="logoutBtn">${icon('logout')} Sign Out</button>
    </div></div>`;
  $('#pfSave').onclick = async () => {
    const { error } = await sb.from('profiles').update({ full_name: $('#pfName').value.trim(), phone: $('#pfPhone').value.trim() }).eq('id', S.user.id);
    if (error) toast(error.message, 'x'); else { toast('Profile saved', 'check'); S.profile.full_name = $('#pfName').value.trim(); }
  };
  $('#logoutBtn').onclick = signOut;
  $('#addrAdd').onclick = () => renderAddrForm();
  renderAddrList();
});
function renderAddrList() {
  const el = $('#addrList'); if (!el) return;
  el.innerHTML = S.addresses.length ? S.addresses.map(a => `
    <div class="cart-line"><div class="cl-info">
      <div class="cl-name">${esc(a.label)} ${a.is_default ? '<span class="pill" style="background:var(--green)">default</span>' : ''}</div>
      <div class="cl-sub">${esc([a.gali_no, a.full_address, a.landmark, a.city, a.pincode].filter(Boolean).join(', '))}</div></div>
      <button class="icon-btn sm" data-aedit="${a.id}" aria-label="Edit">${icon('edit')}</button>
      <button class="icon-btn sm red" data-adel="${a.id}" aria-label="Delete">${icon('trash')}</button>
    </div>`).join('')
    : `<p class="hint">No addresses yet — add one for faster checkout.</p>`;
  el.querySelectorAll('[data-adel]').forEach(b => b.onclick = async () => {
    if (!confirm('Delete this address?')) return;
    await sb.from('addresses').delete().eq('id', b.dataset.adel);
    await loadAddresses(); renderAddrList();
  });
  el.querySelectorAll('[data-aedit]').forEach(b => b.onclick = () => {
    const a = S.addresses.find(x => x.id === b.dataset.aedit); renderAddrForm(a);
  });
}
function renderAddrForm(a = null) {
  const f = $('#addrForm'); if (!f) return;
  f.innerHTML = `<div class="setup-note" style="margin-top:14px"><b>${a ? 'Edit' : 'New'} address</b>
    <div class="addr-fetch" style="margin-top:10px">${icon('pin')}
      <span style="flex:1">Type it yourself, <b>or</b> tap auto-fetch — we'll fill gali/area/city/pincode from your GPS.</span>
      <button class="btn yellow sm" id="addrAuto" type="button">${icon('pin')} Auto-fetch</button></div>
    <div class="row2">
      <div class="field"><label>Label</label><input id="afLabel" value="${esc(a?.label || 'Home')}" placeholder="Home / Office"></div>
      <div class="field"><label>Gali / House No. *</label><input id="afGali" value="${esc(a?.gali_no || '')}" placeholder="Gali no. 4, House 221"></div>
    </div>
    <div class="field"><label>Full address *</label><input id="afFull" value="${esc(a?.full_address || '')}" placeholder="Street, area, colony"></div>
    <div class="row2">
      <div class="field"><label>Landmark</label><input id="afLand" value="${esc(a?.landmark || '')}" placeholder="Near Shiv Mandir"></div>
      <div class="field"><label>City *</label><input id="afCity" value="${esc(a?.city || '')}" placeholder="City"></div>
    </div>
    <div class="row2">
      <div class="field"><label>Pincode *</label><input id="afPin" value="${esc(a?.pincode || '')}" inputmode="numeric" placeholder="110001"></div>
      <div class="field"><label>Default?</label><select id="afDef"><option value="0">No</option><option value="1" ${a?.is_default ? 'selected' : ''}>Yes, make default</option></select></div>
    </div>
    <div style="display:flex;gap:8px"><button class="btn" id="afSave">${icon('check')} Save Address</button>
    <button class="btn ghost" id="afCancel">Cancel</button></div></div>`;
  $('#afCancel').onclick = () => f.innerHTML = '';
  $('#addrAuto').onclick = () => autoFetchAddress();
  $('#afSave').onclick = async () => {
    const rec = {
      user_id: S.user.id, label: $('#afLabel').value.trim() || 'Home',
      gali_no: $('#afGali').value.trim(), full_address: $('#afFull').value.trim(),
      landmark: $('#afLand').value.trim(), city: $('#afCity').value.trim(),
      pincode: $('#afPin').value.trim(), is_default: $('#afDef').value === '1',
      lat: window._afLat ?? a?.lat ?? null, lng: window._afLng ?? a?.lng ?? null,
    };
    if (!rec.full_address || !rec.city || !rec.pincode) { toast('Fill address, city & pincode', 'x'); return; }
    let err, newId = a?.id;
    if (a) ({ error: err } = await sb.from('addresses').update(rec).eq('id', a.id));
    else { const r = await sb.from('addresses').insert(rec).select('id').single(); err = r.error; newId = r.data?.id; }
    if (err) { toast(err.message, 'x'); return; }
    if (rec.is_default && newId) await sb.from('addresses').update({ is_default: false }).eq('user_id', S.user.id).neq('id', newId);
    toast('Address saved', 'check'); f.innerHTML = '';
    await loadAddresses(); renderAddrList(); if (window._coPaint) window._coPaint();
  };
}
/* GPS → reverse-geocode → fill the form (gali typed by user stays) */
function autoFetchAddress() {
  if (!navigator.geolocation) { toast('GPS not available on this device', 'x'); return; }
  toast('Fetching your location…', 'pin');
  navigator.geolocation.getCurrentPosition(async pos => {
    const { latitude: la, longitude: lo } = pos.coords;
    window._afLat = la; window._afLng = lo;
    try {
      const r = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${la}&longitude=${lo}&localityLanguage=en`);
      const j = await r.json();
      const set = (id, v) => { const el = $(id); if (el && v && !el.value) el.value = v; };
      set('#afCity', j.city || j.locality);
      set('#afPin', j.postcode);
      const area = [j.locality, j.city].filter(Boolean).filter((x, i, arr) => arr.indexOf(x) === i).join(', ');
      const road = j.plusCode ? '' : '';
      if ($('#afFull') && !$('#afFull').value) $('#afFull').value = area;
      toast('Location found — add your gali number', 'check');
    } catch { toast('Got GPS coords; type the rest', 'pin'); }
  }, () => toast('Location permission denied', 'x'), { enableHighAccuracy: true, timeout: 12000 });
}

/* ================= CHECKOUT ================= */
route('/checkout', async () => {
  const v = $('#view');
  if (!S.cart.length) { v.innerHTML = `<div class="empty">${icon('cart')}<h3>Your cart is empty</h3><a class="btn" href="#/">Shop Fresh Now</a></div>`; return; }
  if (!S.user) { toast('Sign in to place your order', 'user'); location.hash = '#/auth'; return; }
  if (!needSb()) return;
  await loadAddresses();
  const t = cartTotals();
  const fee = t.total >= 499 ? 0 : 29;
  v.innerHTML = `<div class="form-card" style="max-width:640px"><h2>${icon('wallet')} Checkout</h2>
    <p class="slogan-line">“Paise vasool taazgi — har order par bachat!”</p>
    <div class="section-head"><h2>${icon('pin')} Delivery Address</h2></div>
    <div id="coAddrList"></div>
    <button class="btn yellow" id="coAddrAdd" style="margin:8px 0">${icon('plus')} Add New Address</button>
    <div id="addrForm"></div>
    <div class="field" style="margin-top:10px"><label style="display:flex;align-items:center;gap:8px;cursor:pointer">
      <input type="checkbox" id="coWholesale" style="width:20px;height:20px"> Wholesale order (for restaurants — bulk billing)</label></div>
    <div class="section-head"><h2>${icon('box')} Order Summary</h2></div>
    <div id="coItems"></div>
    <div class="totals-row"><span>Subtotal</span><span>${money(t.total)}</span></div>
    <div class="totals-row"><span>Delivery ${fee === 0 ? '(FREE above ₹499)' : ''}</span><span>${fee === 0 ? 'FREE' : money(fee)}</span></div>
    <div class="totals-row grand"><span>Total</span><span>${money(t.total + fee)}</span></div>
    <button class="btn block" id="placeOrder" style="margin-top:14px">${icon('check')} Place Order • ${money(t.total + fee)}</button>
    <p class="hint" style="margin-top:8px">Pay on delivery. You'll get a 6-digit OTP — share it with the rider only when your sabzi arrives.</p>
  </div>`;
  const paintAddrs = () => {
    $('#coAddrList').innerHTML = S.addresses.length ? S.addresses.map((a, i) => `
      <label class="cart-line" style="cursor:pointer"><input type="radio" name="coAddr" value="${a.id}" ${i === 0 ? 'checked' : ''} style="width:18px;height:18px">
      <div class="cl-info"><div class="cl-name">${esc(a.label)}</div>
      <div class="cl-sub">${esc([a.gali_no, a.full_address, a.landmark, a.city, a.pincode].filter(Boolean).join(', '))}</div></div></label>`).join('')
      : `<p class="hint">No saved address — add one below.</p>`;
  };
  const paintItems = () => {
    $('#coItems').innerHTML = S.cart.map(c => {
      const p = prodById(c.id); if (!p) return '';
      return `<div class="totals-row"><span>${esc(p.name)} × ${fmtQty(p, c.qty)}</span><span>${money(lineTotal(p, c.qty))}</span></div>`;
    }).join('');
  };
  paintAddrs(); paintItems();
  $('#coAddrAdd').onclick = () => { renderAddrForm(); setTimeout(paintAddrs, 100); };
  const origRender = renderAddrList;
  window._coPaint = paintAddrs;
  $('#placeOrder').onclick = async () => {
    const sel = document.querySelector('input[name="coAddr"]:checked');
    if (!sel) { toast('Choose or add a delivery address', 'x'); return; }
    const addr = S.addresses.find(a => a.id === sel.value);
    const btn = $('#placeOrder'); btn.disabled = true; btn.textContent = 'Placing…';
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const wholesale = $('#coWholesale').checked;
    const { data: order, error } = await sb.from('orders').insert({
      user_id: S.user.id, subtotal: t.total, delivery_fee: fee, total: t.total + fee,
      is_wholesale: wholesale, delivery_otp: otp,
      address_snapshot: { label: addr.label, gali_no: addr.gali_no, full_address: addr.full_address, landmark: addr.landmark, city: addr.city, pincode: addr.pincode, lat: addr.lat, lng: addr.lng },
    }).select().single();
    if (error) { toast(error.message, 'x'); btn.disabled = false; return; }
    const items = S.cart.map(c => {
      const p = prodById(c.id);
      const unitPrice = isPiece(p) ? priceOf(p) : priceOf(p);
      return { order_id: order.id, product_id: p.id, product_name: p.name, qty_grams: c.qty, price_per_kg: unitPrice, line_total: lineTotal(p, c.qty) };
    });
    await sb.from('order_items').insert(items);
    await sb.from('notifications').insert({ user_id: S.user.id, title: 'Order placed! 🎉', body: `Order ${order.id.slice(0, 8)} • ${money(order.total)} — we'll notify you at every step.` });
    S.cart = []; saveLocalCart(); if (sb && S.user) await sb.from('cart_items').delete().eq('user_id', S.user.id);
    renderBadges();
    toast('Order placed!', 'check');
    location.hash = '#/order/' + order.id;
  };
});

/* ================= ORDERS + LIVE TRACKING ================= */
const STATUS_STEPS = ['pending', 'confirmed', 'preparing', 'on_the_way', 'delivered'];
const STATUS_HI = { pending: 'Order received', confirmed: 'Confirmed by store', preparing: 'Packing your sabzi', on_the_way: 'Rider is on the way', delivered: 'Delivered', cancelled: 'Cancelled' };
route('/orders', async () => {
  const v = $('#view');
  if (!S.user) { location.hash = '#/auth'; return; }
  if (!needSb()) return;
  const { data } = await sb.from('orders').select('*').eq('user_id', S.user.id).order('created_at', { ascending: false });
  v.innerHTML = `<div class="section-head"><h2>${icon('box')} My Orders</h2></div>
    ${(data || []).length ? data.map(o => `
      <a class="cart-line" href="#/order/${o.id}" style="margin-bottom:10px">
        <div class="cl-info"><div class="cl-name">Order #${o.id.slice(0, 8).toUpperCase()}</div>
        <div class="cl-sub">${new Date(o.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })} • ${money(o.total)}</div></div>
        <span class="pill ${o.status}">${esc(STATUS_HI[o.status] || o.status)}</span>
      </a>`).join('')
    : `<div class="empty">${icon('box')}<h3>No orders yet</h3><p>Your taaza sabzi journey starts here.</p><a class="btn" href="#/">Shop Now</a></div>`}`;
});
route('/order', async (id) => {
  const v = $('#view');
  if (!S.user) { location.hash = '#/auth'; return; }
  if (!needSb()) return;
  const { data: o } = await sb.from('orders').select('*').eq('id', id).single();
  if (!o || (o.user_id !== S.user.id && S.profile?.role !== 'admin' && !(S.profile?.role === 'rider' && o.rider_id === S.user.id))) {
    v.innerHTML = `<div class="empty">${icon('shield')}<h3>Not your order</h3></div>`; return;
  }
  const { data: items } = await sb.from('order_items').select('*').eq('order_id', id);
  const a = o.address_snapshot || {};
  const stepIdx = o.status === 'cancelled' ? -1 : STATUS_STEPS.indexOf(o.status);
  v.innerHTML = `<div class="form-card" style="max-width:640px">
    <h2>${icon('truck')} Order #${o.id.slice(0, 8).toUpperCase()}</h2>
    <p class="sub">${new Date(o.created_at).toLocaleString('en-IN')} • <span class="pill ${o.status}">${esc(STATUS_HI[o.status])}</span>${o.is_wholesale ? ' <span class="pill" style="background:#6A1B9A">WHOLESALE</span>' : ''}</p>
    ${o.status !== 'delivered' && o.status !== 'cancelled' ? `
    <div class="otp-box"><div style="font-size:13px;font-weight:600">🔐 DELIVERY OTP — share with rider on arrival only</div>
      <div class="code">${esc(o.delivery_otp || '------')}</div></div>` : ''}
    <div class="timeline">${STATUS_STEPS.map((s, i) => `
      <div class="tstep ${i < stepIdx ? 'done' : ''} ${i === stepIdx ? 'now' : ''}"><b>${STATUS_HI[s]}</b>
      <small>${i < stepIdx ? 'Done' : i === stepIdx ? 'In progress…' : 'Waiting'}</small></div>`).join('')}
      ${o.status === 'cancelled' ? `<div class="tstep now"><b>Cancelled</b></div>` : ''}</div>
    ${o.status === 'on_the_way' ? `<div class="section-head"><h2>${icon('pin')} Live Rider Location</h2></div><div id="trackMap"></div><p class="hint" id="trackHint">Waiting for rider GPS…</p>` : ''}
    <div class="section-head"><h2>${icon('box')} Items</h2></div>
    ${(items || []).map(it => `<div class="totals-row"><span>${esc(it.product_name)} × ${it.qty_grams >= 1000 && it.qty_grams % 1000 === 0 ? (it.qty_grams / 1000) + ' kg' : it.qty_grams + ' g'}</span><span>${money(it.line_total)}</span></div>`).join('')}
    <div class="totals-row"><span>Delivery</span><span>${o.delivery_fee == 0 ? 'FREE' : money(o.delivery_fee)}</span></div>
    <div class="totals-row grand"><span>Total paid</span><span>${money(o.total)}</span></div>
    <div class="section-head"><h2>${icon('pin')} Delivering to</h2></div>
    <p style="font-size:14px">${esc([a.gali_no, a.full_address, a.landmark, a.city, a.pincode].filter(Boolean).join(', '))}</p>
  </div>`;
  if (o.status === 'on_the_way' && window.L) {
    const map = L.map('trackMap').setView([28.6139, 77.2090], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
    let marker = null, custMarker = null;
    if (a.lat && a.lng) { custMarker = L.marker([a.lat, a.lng]).addTo(map).bindPopup('Your address'); map.setView([a.lat, a.lng], 14); }
    const paint = (la, ln) => {
      if (!marker) marker = L.marker([la, ln], { icon: L.divIcon({ html: '🛵', className: '', iconSize: [28, 28] }) }).addTo(map).bindPopup('Your rider');
      else marker.setLatLng([la, ln]);
      $('#trackHint').textContent = 'Rider is moving — live! 🛵';
    };
    const { data: loc } = await sb.from('rider_locations').select('*').eq('order_id', id).maybeSingle();
    if (loc) paint(loc.lat, loc.lng);
    sb.channel('track-' + id)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rider_locations', filter: `order_id=eq.${id}` }, p2 => paint(p2.new.lat, p2.new.lng))
      .subscribe();
    sb.channel('ord-' + id)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${id}` }, () => router())
      .subscribe();
  }
});

/* ================= FAVOURITES ================= */
route('/favourites', async () => {
  const v = $('#view');
  if (!S.user) { location.hash = '#/auth'; return; }
  const items = S.products.filter(p => S.fav.has(p.id));
  v.innerHTML = `<div class="section-head"><h2>${icon('heart')} My Favourites</h2><span class="pill" style="background:var(--red)">${items.length}</span></div>
    ${items.length ? `<div class="grid">${items.map(productCard).join('')}</div>`
    : `<div class="empty">${icon('heart')}<h3>No favourites yet</h3><p>Tap the heart on any sabzi or fruit to save it here.</p></div>`}`;
});
function renderFavourites() { router(); }

/* ================= SUPABASE SETUP ================= */
route('/setup', async () => {
  const v = $('#view');
  const c = window.JKV_CONFIG || {};
  v.innerHTML = `<div class="form-card"><h2>${icon('key')} Supabase Setup</h2>
    <p class="sub">Connect your Supabase project once — the whole store (catalogue, cart, orders, riders) runs on it.</p>
    <div class="field"><label>Supabase Project URL</label><input id="sbUrl" placeholder="https://xyz.supabase.co" value="${esc(c.SUPABASE_URL || '')}"></div>
    <div class="field"><label>Supabase anon key</label><input id="sbKey" type="password" placeholder="eyJ…" value="${esc(c.SUPABASE_ANON_KEY || '')}"></div>
    <button class="btn block" id="sbSave">${icon('check')} Save & Connect</button>
    <div class="setup-note"><b>One-time checklist in Supabase dashboard:</b>
      <br>1️⃣ SQL Editor → run <code>sql/schema.sql</code> (ships with this site).
      <br>2️⃣ Authentication → Sign In → enable <b>Email OTP</b>.
      <br>3️⃣ Project Settings → Auth → SMTP → add your <b>Gmail</b> (smtp.gmail.com, app password) so OTP mails come from your Gmail.
      <br>4️⃣ After your first sign-in, run: <code>update profiles set role='admin' where email='you@mail.com';</code>
      <br>5️⃣ Storage buckets are created by the SQL — upload product photos from the Admin panel.
    </div>
    <div id="sbStatus"></div>${sbConfigured() ? '' : `<div class="setup-note" style="margin-top:10px">🏃 Running in demo mode — data lives in this browser.<br><button class="btn ghost block" id="demoReset" style="margin-top:8px" type="button">🧹 Reset demo data</button></div>`}</div>`;
  if ($('#demoReset')) $('#demoReset').onclick = () => window.JKV_DemoReset();
  $('#sbSave').onclick = async () => {
    const url = $('#sbUrl').value.trim(), key = $('#sbKey').value.trim();
    if (!url.startsWith('http') || key.length < 20) { toast('Paste a valid URL and anon key', 'x'); return; }
    localStorage.setItem('jkv_sb_url', url); localStorage.setItem('jkv_sb_key', key);
    window.JKV_CONFIG.SUPABASE_URL = url; window.JKV_CONFIG.SUPABASE_ANON_KEY = key;
    sb = null; initSupabase();
    $('#sbStatus').innerHTML = `<p class="hint">Testing connection…</p>`;
    try {
      const { error } = await sb.from('categories').select('id').limit(1);
      if (error) throw error;
      $('#sbStatus').innerHTML = `<div class="setup-note" style="border-color:var(--green)">✅ Connected! Tables found. Now sign in and open the Admin panel to add your catalogue.</div>`;
      toast('Supabase connected', 'check');
      await loadCatalog(); renderChips();
    } catch (e) {
      $('#sbStatus').innerHTML = `<div class="setup-note" style="border-color:var(--red)">⚠️ Connected to Supabase, but tables not found: ${esc(e.message)}<br>Run <code>sql/schema.sql</code> in the SQL Editor, then retry.</div>`;
    }
  };
});

/* home + 404 */
route('/', async () => { renderChips(); renderGrid(); });
route('/404', async () => { $('#view').innerHTML = `<div class="empty">${icon('x')}<h3>Page not found</h3><a class="btn" href="#/">Go Home</a></div>`; });

/* ================= ADMIN PANEL ================= */
async function requireAdmin() {
  if (!S.user) { toast('Sign in first', 'key'); location.hash = '#/auth'; return false; }
  if (!needSb()) return false;
  if (S.profile?.role !== 'admin') {
    $('#view').innerHTML = `<div class="form-card"><h2>${icon('shield')} Admin Login</h2>
      <p class="sub">This area is for the store owner only. Sign in with your admin email + password.</p>
      <div class="field"><label>Email</label><input id="adEmail" type="email" placeholder="owner@jkvegies.com"></div>
      <div class="field"><label>Password</label><input id="adPass" type="password" placeholder="••••••••"></div>
      <button class="btn block" id="adGo">${icon('shield')} Login as Admin</button>
      <p class="hint" style="margin-top:10px">No password yet? Sign in once with OTP as a customer, then run in Supabase SQL:<br><code>update profiles set role='admin' where email='you@mail.com';</code><br>then use “Forgot password” on this page to set an admin password (email comes from your Gmail).</p>
      <button class="btn ghost block" id="adForgot" style="margin-top:8px">Email me a password reset</button></div>`;
    $('#adGo').onclick = async () => {
      const { error } = await sb.auth.signInWithPassword({ email: $('#adEmail').value.trim(), password: $('#adPass').value });
      if (error) { toast(error.message, 'x'); return; }
      await refreshSession(); router();
    };
    $('#adForgot').onclick = async () => {
      const em = $('#adEmail').value.trim();
      if (!em) { toast('Enter your email first', 'x'); return; }
      const { error } = await sb.auth.resetPasswordForEmail(em);
      toast(error ? error.message : 'Reset email sent (via your Gmail)', error ? 'x' : 'send');
    };
    return false;
  }
  return true;
}
async function uploadPhoto(file, bucket) {
  const ext = (file.name.split('.').pop() || 'jpg').slice(0, 4);
  const path = `jkv-${uid()}.${ext}`;
  const { error } = await sb.storage.from(bucket).upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;
  return sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
route('/admin', async () => {
  const v = $('#view');
  if (!await requireAdmin()) return;
  const tab = new URLSearchParams((location.hash.split('?')[1] || '')).get('tab') || 'dash';
  v.innerHTML = `<div class="section-head"><h2>${icon('shield')} Admin Panel</h2><span class="pill" style="background:var(--green)">${esc(S.profile.full_name || S.user.email)}</span></div>
    <div class="tabs">
      ${[['dash', 'Dashboard', 'store'], ['products', 'Products', 'box'], ['cats', 'Categories', 'leaf'], ['orders', 'Orders', 'truck'], ['riders', 'Riders', 'bike'], ['notifs', 'Notifications', 'bell']].map(([k, l, ic]) =>
      `<button class="tab ${tab === k ? 'active' : ''}" data-atab="${k}">${icon(ic)} ${l}</button>`).join('')}
    </div><div id="adminBody"></div>`;
  v.querySelectorAll('[data-atab]').forEach(b => b.onclick = () => location.hash = '#/admin?tab=' + b.dataset.atab);
  const B = $('#adminBody');
  if (tab === 'dash') {
    const [{ count: pc }, { data: orders }] = await Promise.all([
      sb.from('products').select('id', { count: 'exact', head: true }),
      sb.from('orders').select('total,status,created_at').neq('status', 'cancelled'),
    ]);
    const today = new Date().toISOString().slice(0, 10);
    const todayOrders = (orders || []).filter(o => o.created_at.slice(0, 10) === today);
    const revenue = (orders || []).filter(o => o.status === 'delivered').reduce((s, o) => s + Number(o.total), 0);
    const active = (orders || []).filter(o => !['delivered', 'cancelled'].includes(o.status)).length;
    B.innerHTML = `<div class="stat-row">
      <div class="stat"><b>${pc || 0}</b><span>Products live</span></div>
      <div class="stat"><b>${todayOrders.length}</b><span>Orders today</span></div>
      <div class="stat"><b>${active}</b><span>Active orders</span></div>
      <div class="stat"><b>${money(revenue)}</b><span>Delivered revenue</span></div></div>
      <div class="setup-note"><b>Owner quickstart:</b> ① <a href="#/admin?tab=cats">Categories</a> — add “Vegetables / Exotic / Organic” + “Fruits / Normal / Organic / Exotic” with photos. ② <a href="#/admin?tab=products">Products</a> — add items with rate & discounted price. ③ Share the site link — customers order, you manage them under <a href="#/admin?tab=orders">Orders</a>.</div>`;
  }
  if (tab === 'cats') {
    const { data: cats } = await sb.from('categories').select('*').order('sort_order');
    B.innerHTML = `<button class="btn" id="catNew">${icon('plus')} Add Category</button><div id="catForm"></div>
      <div class="tbl-wrap" style="margin-top:12px"><table class="tbl"><tr><th>Photo</th><th>Name</th><th>Kind</th><th>Tag</th><th>Active</th><th></th></tr>
      ${(cats || []).map(c => `<tr><td>${c.image_url ? `<img class="thumb" src="${esc(c.image_url)}">` : '—'}</td><td><b>${esc(c.name)}</b></td><td>${c.kind}</td><td>${c.tag}</td><td>${c.is_active ? '✅' : '❌'}</td>
        <td><button class="icon-btn sm" data-cedit="${c.id}">${icon('edit')}</button> <button class="icon-btn sm red" data-cdel="${c.id}">${icon('trash')}</button></td></tr>`).join('')}</table></div>`;
    const form = (c = null) => { $('#catForm').innerHTML = `<div class="setup-note"><b>${c ? 'Edit' : 'New'} category</b>
      <div class="row2" style="margin-top:8px"><div class="field"><label>Name *</label><input id="cfName" value="${esc(c?.name || '')}" placeholder="Exotic Vegetables"></div>
      <div class="field"><label>Photo</label><input id="cfImg" type="file" accept="image/*"></div></div>
      <div class="row2"><div class="field"><label>Kind</label><select id="cfKind"><option value="vegetable" ${c?.kind === 'vegetable' ? 'selected' : ''}>Vegetable</option><option value="fruit" ${c?.kind === 'fruit' ? 'selected' : ''}>Fruit</option></select></div>
      <div class="field"><label>Tag</label><select id="cfTag">${['normal', 'exotic', 'organic'].map(t => `<option ${c?.tag === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div></div>
      <div class="row2"><div class="field"><label>Sort order</label><input id="cfSort" type="number" value="${c?.sort_order ?? 0}"></div>
      <div class="field"><label>Active</label><select id="cfAct"><option value="1" ${c?.is_active !== false ? 'selected' : ''}>Yes</option><option value="0" ${c?.is_active === false ? 'selected' : ''}>No</option></select></div></div>
      <div style="display:flex;gap:8px"><button class="btn" id="cfSave">${icon('check')} Save</button><button class="btn ghost" id="cfX">Cancel</button></div></div>`;
      $('#cfX').onclick = () => $('#catForm').innerHTML = '';
      $('#cfSave').onclick = async () => {
        try {
          const file = $('#cfImg').files[0];
          const img = file ? await uploadPhoto(file, 'category-images') : (c?.image_url || null);
          const rec = { name: $('#cfName').value.trim(), kind: $('#cfKind').value, tag: $('#cfTag').value, image_url: img, sort_order: Number($('#cfSort').value) || 0, is_active: $('#cfAct').value === '1' };
          if (!rec.name) { toast('Name is required', 'x'); return; }
          const { error } = c ? await sb.from('categories').update(rec).eq('id', c.id) : await sb.from('categories').insert(rec);
          if (error) throw error; toast('Category saved', 'check'); router();
        } catch (e) { toast(e.message, 'x'); }
      };
    };
    $('#catNew').onclick = () => form();
    B.querySelectorAll('[data-cedit]').forEach(b => b.onclick = () => form(cats.find(x => x.id === b.dataset.cedit)));
    B.querySelectorAll('[data-cdel]').forEach(b => b.onclick = async () => {
      if (!confirm('Delete this category? Products stay but become uncategorised.')) return;
      await sb.from('categories').delete().eq('id', b.dataset.cdel); toast('Deleted', 'trash'); router();
    });
  }
  if (tab === 'products') {
    const [{ data: cats }, { data: prods }] = await Promise.all([
      sb.from('categories').select('id,name').eq('is_active', true).order('sort_order'),
      sb.from('products').select('*,categories(name)').order('name'),
    ]);
    B.innerHTML = `<button class="btn" id="prNew">${icon('plus')} Add Product</button><div id="prForm"></div>
      <div class="tbl-wrap" style="margin-top:12px"><table class="tbl"><tr><th>Photo</th><th>Name</th><th>Category</th><th>Rate</th><th>Discounted</th><th>Unit</th><th>Live</th><th></th></tr>
      ${(prods || []).map(p => `<tr><td>${p.image_url ? `<img class="thumb" src="${esc(p.image_url)}">` : '—'}</td><td><b>${esc(p.name)}</b></td><td>${esc(p.categories?.name || '—')}</td>
        <td>${money(p.price)}/kg</td><td>${p.discount_price != null ? money(p.discount_price) : '—'}</td><td>${p.unit}</td><td>${p.is_active ? '✅' : '❌'}</td>
        <td style="white-space:nowrap"><button class="icon-btn sm" data-pedit="${p.id}">${icon('edit')}</button> <button class="icon-btn sm red" data-pdel="${p.id}">${icon('trash')}</button></td></tr>`).join('')}</table></div>`;
    const form = (p = null) => { $('#prForm').innerHTML = `<div class="setup-note"><b>${p ? 'Edit' : 'New'} product</b>
      <div class="row2" style="margin-top:8px"><div class="field"><label>Name *</label><input id="pfN" value="${esc(p?.name || '')}" placeholder="Tomato (Desi)"></div>
      <div class="field"><label>Photo *</label><input id="pfI" type="file" accept="image/*">${p?.image_url ? `<p class="hint">Current photo kept unless you choose a new one.</p>` : ''}</div></div>
      <div class="field"><label>Description</label><input id="pfD" value="${esc(p?.description || '')}" placeholder="Fresh, firm, farm-direct…"></div>
      <div class="row2"><div class="field"><label>Category</label><select id="pfC"><option value="">— none —</option>${cats.map(c => `<option value="${c.id}" ${p?.category_id === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></div>
      <div class="field"><label>Unit</label><select id="pfU"><option value="kg" ${p?.unit === 'kg' ? 'selected' : ''}>per kg (qty in grams)</option><option value="piece" ${p?.unit === 'piece' ? 'selected' : ''}>per piece</option></select></div></div>
      <div class="row2"><div class="field"><label>Rate (₹) *</label><input id="pfP" type="number" min="0" step="0.5" value="${p?.price ?? ''}" placeholder="40"></div>
      <div class="field"><label>Discounted price (₹) — leave empty for none</label><input id="pfDp" type="number" min="0" step="0.5" value="${p?.discount_price ?? ''}" placeholder="32"></div></div>
      <div class="field"><label>Live on site?</label><select id="pfA"><option value="1" ${p?.is_active !== false ? 'selected' : ''}>Yes</option><option value="0" ${p?.is_active === false ? 'selected' : ''}>No</option></select></div>
      <div style="display:flex;gap:8px"><button class="btn" id="pfS">${icon('check')} Save Product</button><button class="btn ghost" id="pfX">Cancel</button></div></div>`;
      $('#pfX').onclick = () => $('#prForm').innerHTML = '';
      $('#pfS').onclick = async () => {
        try {
          const file = $('#pfI').files[0];
          if (!file && !p?.image_url) { toast('Add a product photo', 'x'); return; }
          const img = file ? await uploadPhoto(file, 'product-images') : p.image_url;
          const dp = $('#pfDp').value.trim();
          const rec = { name: $('#pfN').value.trim(), description: $('#pfD').value.trim(), category_id: $('#pfC').value || null, unit: $('#pfU').value, price: Number($('#pfP').value) || 0, discount_price: dp === '' ? null : Number(dp), image_url: img, is_active: $('#pfA').value === '1' };
          if (!rec.name || !rec.price) { toast('Name and rate are required', 'x'); return; }
          const { error } = p ? await sb.from('products').update(rec).eq('id', p.id) : await sb.from('products').insert(rec);
          if (error) throw error; toast('Product saved', 'check'); router();
        } catch (e) { toast(e.message, 'x'); }
      };
    };
    $('#prNew').onclick = () => form();
    B.querySelectorAll('[data-pedit]').forEach(b => b.onclick = () => form(prods.find(x => x.id === b.dataset.pedit)));
    B.querySelectorAll('[data-pdel]').forEach(b => b.onclick = async () => {
      if (!confirm('Delete this product?')) return;
      await sb.from('products').delete().eq('id', b.dataset.pdel); toast('Deleted', 'trash'); router();
    });
  }
  if (tab === 'orders') {
    const f = new URLSearchParams((location.hash.split('?')[1] || '')).get('f') || 'active';
    const { data: orders } = await sb.from('orders').select('*,profiles!orders_user_id_fkey(full_name,phone,email)').order('created_at', { ascending: false }).limit(100);
    const { data: riders } = await sb.from('profiles').select('id,full_name,email').eq('role', 'rider');
    const list = (orders || []).filter(o => f === 'all' ? true : f === 'active' ? !['delivered', 'cancelled'].includes(o.status) : o.status === f);
    B.innerHTML = `<div class="tabs">${[['active', 'Active'], ['pending', 'Pending'], ['confirmed', 'Confirmed'], ['preparing', 'Preparing'], ['on_the_way', 'On the way'], ['delivered', 'Delivered'], ['cancelled', 'Cancelled'], ['all', 'All']].map(([k, l]) =>
      `<button class="tab ${f === k ? 'active' : ''}" data-of="${k}">${l}</button>`).join('')}</div>
      <div id="ordList">${list.length ? '' : `<div class="empty">${icon('box')}<h3>No orders here</h3></div>`}</div>`;
    B.querySelectorAll('[data-of]').forEach(b => b.onclick = () => location.hash = '#/admin?tab=orders&f=' + b.dataset.of);
    const OL = $('#ordList');
    for (const o of list) {
      const card = document.createElement('div');
      card.className = 'cart-line'; card.style.cssText = 'margin-bottom:10px;align-items:flex-start;flex-wrap:wrap';
      const a = o.address_snapshot || {};
      card.innerHTML = `<div class="cl-info" style="min-width:220px">
          <div class="cl-name">Order #${o.id.slice(0, 8).toUpperCase()} ${o.is_wholesale ? '<span class="pill" style="background:#6A1B9A">WHOLESALE</span>' : ''}</div>
          <div class="cl-sub">👤 ${esc(o.profiles?.full_name || o.profiles?.email || 'Customer')} ${o.profiles?.phone ? '• 📞 ' + esc(o.profiles.phone) : ''}</div>
          <div class="cl-sub">📍 ${esc([a.gali_no, a.full_address, a.city, a.pincode].filter(Boolean).join(', '))}</div>
          <div class="cl-sub">💰 ${money(o.total)} (delivery ${o.delivery_fee == 0 ? 'FREE' : money(o.delivery_fee)}) • ${new Date(o.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</div>
          <div class="cl-sub items" style="margin-top:6px"><i>Loading items…</i></div></div>
        <div style="display:flex;flex-direction:column;gap:8px;min-width:200px">
          <span class="pill ${o.status}">${esc(STATUS_HI[o.status] || o.status)}</span>
          <select data-rider style="border:2px solid #E8DCC8;border-radius:8px;padding:8px;font-family:var(--font)">
            <option value="">— Assign rider —</option>${(riders || []).map(r => `<option value="${r.id}" ${o.rider_id === r.id ? 'selected' : ''}>${esc(r.full_name || r.email)}</option>`).join('')}</select>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            ${o.status === 'pending' ? `<button class="btn yellow" data-st="confirmed">Confirm</button>` : ''}
            ${o.status === 'confirmed' ? `<button class="btn yellow" data-st="preparing">Preparing</button>` : ''}
            ${o.status === 'preparing' ? `<button class="btn yellow" data-st="on_the_way">Dispatch</button>` : ''}
            ${!['delivered', 'cancelled'].includes(o.status) ? `<button class="btn ghost" data-st="cancelled">Cancel</button>` : ''}
          </div></div>`;
      OL.appendChild(card);
      sb.from('order_items').select('*').eq('order_id', o.id).then(({ data: its }) => {
        card.querySelector('.items').innerHTML = '🧺 ' + (its || []).map(it => `${esc(it.product_name)} × ${it.qty_grams}g`).join(', ');
      });
      card.querySelector('[data-rider]').onchange = async e => {
        const rid = e.target.value || null;
        const { error } = await sb.from('orders').update({ rider_id: rid, status: rid && o.status === 'pending' ? 'confirmed' : o.status }).eq('id', o.id);
        if (error) toast(error.message, 'x'); else { toast(rid ? 'Rider assigned' : 'Rider removed', 'bike'); if (rid) await sb.from('notifications').insert({ user_id: rid, title: 'New delivery assigned 🛵', body: `Order #${o.id.slice(0, 8).toUpperCase()} — open the Rider panel.` }); router(); }
      };
      card.querySelectorAll('[data-st]').forEach(b => b.onclick = async () => {
        const ns = b.dataset.st === 'cancelled' ? 'cancelled' : b.dataset.st;
        if (ns === 'cancelled' && !confirm('Cancel this order?')) return;
        const { error } = await sb.from('orders').update({ status: ns }).eq('id', o.id);
        if (error) toast(error.message, 'x'); else { toast('Order ' + STATUS_HI[ns], 'check'); await sb.from('notifications').insert({ user_id: o.user_id, title: `Order ${STATUS_HI[ns]}`, body: `Your order #${o.id.slice(0, 8).toUpperCase()} is now: ${STATUS_HI[ns]}.` }); router(); }
      });
    }
  }
  if (tab === 'riders') {
    const { data: people } = await sb.from('profiles').select('*').order('created_at', { ascending: false }).limit(100);
    B.innerHTML = `<div class="setup-note"><b>How riders join:</b> the rider signs in once on the site with email OTP (creates their account), then you set their role to <b>rider</b> below. They then set a password via the Rider Login → “forgot password” email (comes from your Gmail) and use the Rider panel.</div>
      <div class="tbl-wrap"><table class="tbl"><tr><th>Name / Email</th><th>Phone</th><th>Role</th><th>Joined</th><th></th></tr>
      ${(people || []).map(p => `<tr><td><b>${esc(p.full_name || '—')}</b><br><small>${esc(p.email || '')}</small></td><td>${esc(p.phone || '—')}</td>
        <td><span class="pill" style="background:${p.role === 'admin' ? '#6A1B9A' : p.role === 'rider' ? '#00897B' : '#9E9E9E'}">${p.role}</span></td>
        <td><small>${new Date(p.created_at).toLocaleDateString('en-IN')}</small></td>
        <td><select data-role="${p.id}" style="border:2px solid #E8DCC8;border-radius:8px;padding:6px">
          ${['customer', 'rider', 'admin'].map(r => `<option ${p.role === r ? 'selected' : ''}>${r}</option>`).join('')}</select></td></tr>`).join('')}</table></div>`;
    B.querySelectorAll('[data-role]').forEach(s => s.onchange = async () => {
      const { error } = await sb.from('profiles').update({ role: s.value }).eq('id', s.dataset.role);
      toast(error ? error.message : `Role → ${s.value}`, error ? 'x' : 'check'); if (!error) router();
    });
  }
  if (tab === 'notifs') {
    const { data: ns } = await sb.from('notifications').select('*').is('user_id', null).order('created_at', { ascending: false }).limit(20);
    B.innerHTML = `<div class="setup-note"><b>📢 Broadcast notification</b> — reaches every customer instantly (bell icon + popup).
      <div class="field" style="margin-top:8px"><label>Title</label><input id="nbT" placeholder="🥬 Fresh methi just arrived!"></div>
      <div class="field"><label>Message</label><textarea id="nbB" rows="2" placeholder="Farm-fresh methi at ₹25/kg — today only."></textarea></div>
      <button class="btn" id="nbSend">${icon('send')} Send to All Customers</button></div>
      <div class="section-head"><h2>${icon('bell')} Recent broadcasts</h2></div>
      ${(ns || []).map(n => `<div class="notif-card"><h4>${esc(n.title)}</h4><p>${esc(n.body)}</p><time>${new Date(n.created_at).toLocaleString('en-IN')}</time></div>`).join('') || '<p class="hint">None yet.</p>'}`;
    $('#nbSend').onclick = async () => {
      const t = $('#nbT').value.trim(), b = $('#nbB').value.trim();
      if (!t) { toast('Title is required', 'x'); return; }
      const { error } = await sb.from('notifications').insert({ title: t, body: b });
      if (error) toast(error.message, 'x'); else { toast('Broadcast sent!', 'send'); router(); }
    };
  }
});

/* ================= RIDER PANEL ================= */
const riderWatch = {};
async function requireRider() {
  if (!S.user) { toast('Sign in first', 'key'); location.hash = '#/auth'; return false; }
  if (!needSb()) return false;
  if (!['rider', 'admin'].includes(S.profile?.role)) {
    $('#view').innerHTML = `<div class="form-card"><h2>${icon('bike')} Rider Login</h2>
      <p class="sub">Deliveries, live tracking & OTP handover — for JK Vegies riders.</p>
      <div class="field"><label>Email</label><input id="rdEmail" type="email"></div>
      <div class="field"><label>Password</label><input id="rdPass" type="password"></div>
      <button class="btn block" id="rdGo">${icon('bike')} Login as Rider</button>
      <button class="btn ghost block" id="rdForgot" style="margin-top:8px">Email me a password reset</button>
      <p class="hint" style="margin-top:10px">New rider? Ask the owner to mark your account as <b>rider</b> (Admin → Riders), then set your password with the reset email.</p></div>`;
    $('#rdGo').onclick = async () => {
      const { error } = await sb.auth.signInWithPassword({ email: $('#rdEmail').value.trim(), password: $('#rdPass').value });
      if (error) { toast(error.message, 'x'); return; }
      await refreshSession(); router();
    };
    $('#rdForgot').onclick = async () => {
      const em = $('#rdEmail').value.trim(); if (!em) { toast('Enter email first', 'x'); return; }
      const { error } = await sb.auth.resetPasswordForEmail(em);
      toast(error ? error.message : 'Reset email sent', error ? 'x' : 'send');
    };
    return false;
  }
  return true;
}
function startRiderGps(orderId) {
  if (riderWatch[orderId] || !navigator.geolocation) return;
  riderWatch[orderId] = navigator.geolocation.watchPosition(async pos => {
    await sb.from('rider_locations').upsert({ rider_id: S.user.id, order_id: orderId, lat: pos.coords.latitude, lng: pos.coords.longitude, updated_at: new Date().toISOString() });
  }, null, { enableHighAccuracy: true, maximumAge: 5000 });
}
function stopRiderGps(orderId) {
  if (riderWatch[orderId]) { navigator.geolocation.clearWatch(riderWatch[orderId]); delete riderWatch[orderId]; }
  sb.from('rider_locations').delete().eq('rider_id', S.user.id).then(() => {});
}
route('/rider', async () => {
  const v = $('#view');
  if (!await requireRider()) return;
  const me = S.profile.role === 'admin' ? null : S.user.id;
  let q = sb.from('orders').select('*,profiles!orders_user_id_fkey(full_name,phone)').order('created_at', { ascending: false }).limit(50);
  if (me) q = q.eq('rider_id', me);
  const { data: orders } = await q;
  const mine = (orders || []).filter(o => !['delivered', 'cancelled'].includes(o.status));
  const done = (orders || []).filter(o => ['delivered', 'cancelled'].includes(o.status));
  const card = o => {
    const a = o.address_snapshot || {};
    return `<div class="cart-line" style="margin-bottom:10px;align-items:flex-start;flex-wrap:wrap">
      <div class="cl-info" style="min-width:220px">
        <div class="cl-name">Order #${o.id.slice(0, 8).toUpperCase()} ${o.is_wholesale ? '<span class="pill" style="background:#6A1B9A">WHOLESALE</span>' : ''}</div>
        <div class="cl-sub">👤 ${esc(o.profiles?.full_name || 'Customer')} ${o.profiles?.phone ? `• <a href="tel:${esc(o.profiles.phone)}">📞 ${esc(o.profiles.phone)}</a>` : ''}</div>
        <div class="cl-sub">📍 ${esc([a.gali_no, a.full_address, a.landmark, a.city, a.pincode].filter(Boolean).join(', '))}</div>
        <div class="cl-sub">💰 Collect ${money(o.total)} ${o.delivery_fee == 0 ? '(delivery FREE)' : ''}</div>
        <div class="cl-sub items" data-items="${o.id}"><i>Loading items…</i></div></div>
      <div style="display:flex;flex-direction:column;gap:8px;min-width:210px">
        <span class="pill ${o.status}">${esc(STATUS_HI[o.status] || o.status)}</span>
        ${o.status !== 'on_the_way' && o.status !== 'delivered' ? `<button class="btn yellow" data-pick="${o.id}">${icon('bike')} Picked up — Start Delivery</button>` : ''}
        ${o.status === 'on_the_way' ? `<div class="field" style="margin:0"><label>Delivery OTP (ask customer)</label>
          <input data-otp="${o.id}" inputmode="numeric" maxlength="6" placeholder="••••••" style="letter-spacing:4px;text-align:center;font-weight:700"></div>
          <button class="btn green" data-done="${o.id}">${icon('check')} Verify OTP & Complete</button>
          <p class="hint">📡 Live location broadcasting… keep this page open.</p>` : ''}
      </div></div>`;
  };
  v.innerHTML = `<div class="section-head"><h2>${icon('bike')} Rider Panel</h2><span class="pill" style="background:var(--green)">${esc(S.profile.full_name || S.user.email)}</span></div>
    <p class="slogan-line">“Time par delivery, har baar — JK Vegies ka vaada!”</p>
    <div class="section-head"><h2>${icon('truck')} My Deliveries (${mine.length})</h2></div>
    <div id="rActive">${mine.length ? mine.map(card).join('') : `<div class="empty">${icon('bike')}<h3>No active deliveries</h3><p>New assigned orders will appear here with a notification.</p></div>`}</div>
    ${done.length ? `<div class="section-head"><h2>${icon('check')} Completed</h2></div><div>${done.map(card).join('')}</div>` : ''}`;
  for (const o of [...mine, ...done]) {
    const { data: its } = await sb.from('order_items').select('*').eq('order_id', o.id);
    v.querySelectorAll(`[data-items="${o.id}"]`).forEach(el => el.innerHTML = '🧺 ' + (its || []).map(it => `${esc(it.product_name)} × ${it.qty_grams}g`).join(', '));
  }
  v.querySelectorAll('[data-pick]').forEach(b => b.onclick = async () => {
    const id = b.dataset.pick;
    const { error } = await sb.from('orders').update({ status: 'on_the_way' }).eq('id', id);
    if (error) { toast(error.message, 'x'); return; }
    startRiderGps(id);
    const { data: o } = await sb.from('orders').select('user_id').eq('id', id).single();
    await sb.from('notifications').insert({ user_id: o.user_id, title: 'Rider is on the way! 🛵', body: `Your order #${id.slice(0, 8).toUpperCase()} is coming — track it live.` });
    toast('Delivery started — GPS live', 'bike'); router();
  });
  v.querySelectorAll('[data-done]').forEach(b => b.onclick = async () => {
    const id = b.dataset.done;
    const otpIn = v.querySelector(`[data-otp="${id}"]`).value.trim();
    const { data: o } = await sb.from('orders').select('delivery_otp,user_id').eq('id', id).single();
    if (otpIn !== o.delivery_otp) { toast('Wrong OTP — ask the customer again', 'x'); return; }
    await sb.from('orders').update({ status: 'delivered' }).eq('id', id);
    stopRiderGps(id);
    await sb.from('notifications').insert({ user_id: o.user_id, title: 'Delivered! ✅', body: `Order #${id.slice(0, 8).toUpperCase()} delivered. Enjoy the freshness!` });
    toast('Delivered! Shabaash! 🎉', 'check'); router();
  });
  // resume GPS for any on-the-way orders while panel is open
  mine.filter(o => o.status === 'on_the_way').forEach(o => startRiderGps(o.id));
});
