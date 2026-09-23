-- ============================================================
-- JK Vegies — Supabase schema (run in Supabase SQL Editor)
-- ============================================================
create extension if not exists pgcrypto;

-- customers / owners / riders (keyed by auth user)
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique,
  name text,
  role text default 'customer',       -- customer | admin | rider
  created_at timestamptz default now()
);

-- catalog: vegetables & fruits (normal / exotic / organic)
create table if not exists products (
  id text primary key,
  name text not null,
  cat text check (cat in ('veg','fruit')),
  tag text check (tag in ('normal','exotic','organic')),
  unit text default 'kg',             -- kg (grams granularity) | pcs
  price numeric not null,             -- your rate (selling price)
  mrp numeric not null,               -- displayed struck-through
  ws numeric default 0,               -- wholesale rate (restaurants)
  stock int default 0,
  descr text,
  photo text,                         -- url or data-url
  approved boolean default false,     -- owner approval gate
  added_by text,
  at timestamptz default now()
);

-- saved addresses (gali-level)
create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  house text, street text, landmark text, area text,
  city text, state text, pin text, full text,
  lat double precision, lon double precision,
  is_default boolean default true
);

-- orders with live status + delivery OTP
create table if not exists orders (
  id text primary key,
  at timestamptz default now(),
  email text,
  name text,
  mode text,                          -- retail | wholesale
  lines jsonb not null,
  totals jsonb not null,
  addr jsonb not null,
  status text default 'placed',       -- placed|accepted|picked|transit|delivered|cancelled
  otp text,
  rider jsonb,
  rider_pos jsonb
);

-- notification feed
create table if not exists notifications (
  id text primary key,
  title text,
  body text,
  at timestamptz default now(),
  read boolean default false
);

-- heart button favourites
create table if not exists favorites (
  user_id uuid references auth.users on delete cascade,
  product_id text references products on delete cascade,
  primary key (user_id, product_id)
);

-- ---------- Row Level Security ----------
alter table profiles    enable row level security;
alter table products    enable row level security;
alter table addresses   enable row level security;
alter table orders      enable row level security;
alter table notifications enable row level security;
alter table favorites   enable row level security;

create policy "profiles self read"   on profiles    for select using (auth.uid() = id);
create policy "profiles self write"  on profiles    for insert with check (auth.uid() = id);
create policy "catalog public read"  on products    for select using (approved = true or auth.email() = 'admin@jkvegies.in');
create policy "catalog admin write"  on products    for insert with check (auth.email() = 'admin@jkvegies.in');
create policy "catalog admin update" on products    for update using (auth.email() = 'admin@jkvegies.in');
create policy "addresses self"       on addresses   for all using (auth.uid() = user_id);
create policy "orders self read"     on orders      for select using (auth.email() = email or auth.email() = 'admin@jkvegies.in');
create policy "orders self insert"   on orders      for insert with check (auth.email() = email);
create policy "orders staff update"  on orders      for update using (auth.email() = email or auth.email() = 'admin@jkvegies.in');
create policy "notif public read"    on notifications for select using (true);
create policy "favorites self"       on favorites    for all using (auth.uid() = user_id);

-- ---------- Realtime (cart/order/rider live updates) ----------
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table notifications;
