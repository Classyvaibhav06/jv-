-- ============================================================
-- JK VEGIES — Supabase schema
-- Run this ONCE in your Supabase project: SQL Editor > New query
-- ============================================================

-- ---------- helper: is the current user an admin? ----------
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.is_rider()
returns boolean language sql security definer stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','rider'));
$$;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer','admin','rider')),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles: owner read/update, admin all"
  on public.profiles for all using (auth.uid() = id or public.is_admin()) with check (auth.uid() = id or public.is_admin());

-- auto-create a profile row whenever a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name',''));
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- categories (Vegetables: normal/exotic/organic, Fruits: normal/organic/exotic) ----------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kind text not null check (kind in ('vegetable','fruit')),
  tag text not null default 'normal' check (tag in ('normal','exotic','organic')),
  image_url text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;
create policy "categories: public read active" on public.categories for select using (is_active = true);
create policy "categories: admin write" on public.categories for all using (public.is_admin()) with check (public.is_admin());

-- ---------- products ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text default '',
  price numeric(10,2) not null,              -- rate per kg
  discount_price numeric(10,2),              -- discounted rate per kg (null = no discount)
  unit text not null default 'kg',           -- 'kg' or 'piece'
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.products enable row level security;
create policy "products: public read active" on public.products for select using (is_active = true);
create policy "products: admin write" on public.products for all using (public.is_admin()) with check (public.is_admin());

-- ---------- favourites (heart button) ----------
create table if not exists public.favourites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);
alter table public.favourites enable row level security;
create policy "favourites: owner all" on public.favourites for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- addresses ----------
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null default 'Home',
  full_address text not null,
  gali_no text default '',
  landmark text default '',
  city text default '',
  pincode text default '',
  lat double precision,
  lng double precision,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.addresses enable row level security;
create policy "addresses: owner all" on public.addresses for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- cart (synced when logged in; guests use localStorage) ----------
create table if not exists public.cart_items (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  qty_grams int not null default 500 check (qty_grams > 0),
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);
alter table public.cart_items enable row level security;
create policy "cart: owner all" on public.cart_items for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- orders ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending','confirmed','preparing','on_the_way','delivered','cancelled')),
  subtotal numeric(10,2) not null default 0,
  delivery_fee numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  is_wholesale boolean not null default false,
  address_snapshot jsonb not null default '{}'::jsonb,
  rider_id uuid references public.profiles(id) on delete set null,
  delivery_otp text,                          -- 6-digit code the rider must enter
  created_at timestamptz not null default now()
);
alter table public.orders enable row level security;
create policy "orders: customer insert+read own" on public.orders for all
  using (auth.uid() = user_id or public.is_admin() or (public.is_rider() and rider_id = auth.uid()))
  with check (auth.uid() = user_id or public.is_admin());
create policy "orders: admin update" on public.orders for update
  using (public.is_admin() or (public.is_rider() and rider_id = auth.uid()));

-- ---------- order items ----------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  qty_grams int not null,
  price_per_kg numeric(10,2) not null,
  line_total numeric(10,2) not null
);
alter table public.order_items enable row level security;
create policy "order_items: via order access" on public.order_items for all
  using (exists (select 1 from public.orders o where o.id = order_id
    and (o.user_id = auth.uid() or public.is_admin() or (public.is_rider() and o.rider_id = auth.uid()))))
  with check (exists (select 1 from public.orders o where o.id = order_id
    and (o.user_id = auth.uid() or public.is_admin())));

-- ---------- notifications ----------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,  -- null = broadcast to all
  title text not null,
  body text not null default '',
  created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;
create policy "notifications: read own + broadcasts" on public.notifications for select
  using (user_id is null or user_id = auth.uid() or public.is_admin());
create policy "notifications: admin write" on public.notifications for all
  using (public.is_admin()) with check (public.is_admin());

create table if not exists public.notification_reads (
  notification_id uuid not null references public.notifications(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (notification_id, user_id)
);
alter table public.notification_reads enable row level security;
create policy "notif_reads: owner all" on public.notification_reads for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- live rider locations ----------
create table if not exists public.rider_locations (
  rider_id uuid primary key references public.profiles(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  lat double precision not null,
  lng double precision not null,
  updated_at timestamptz not null default now()
);
alter table public.rider_locations enable row level security;
create policy "rider_locations: rider writes own" on public.rider_locations for all
  using (rider_id = auth.uid() or public.is_admin()) with check (rider_id = auth.uid() or public.is_admin());
create policy "rider_locations: customer reads own order rider" on public.rider_locations for select
  using (public.is_admin() or exists (select 1 from public.orders o
    where o.id = rider_locations.order_id and o.user_id = auth.uid()));

-- ---------- storage buckets (product & category photos) ----------
insert into storage.buckets (id, name, public)
values ('product-images','product-images', true), ('category-images','category-images', true)
on conflict (id) do nothing;

create policy "storage: public read images" on storage.objects for select
  using (bucket_id in ('product-images','category-images'));
create policy "storage: admin upload images" on storage.objects for insert
  with check (bucket_id in ('product-images','category-images') and public.is_admin());
create policy "storage: admin manage images" on storage.objects for update using (public.is_admin());
create policy "storage: admin delete images" on storage.objects for delete using (public.is_admin());

-- ---------- helpful indexes ----------
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_active on public.products(is_active);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_rider on public.orders(rider_id);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_notifications_user on public.notifications(user_id);

-- ---------- make YOURSELF admin (run after your first sign-in; replace the email) ----------
-- update public.profiles set role = 'admin' where email = 'you@example.com';
