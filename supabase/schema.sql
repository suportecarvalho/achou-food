-- ==============================================================================
-- ACHOU FOOD - SUPABASE POSTGRESQL SCHEMA
-- Lovable-compatible Database Schema with RLS, Storage & Seeds
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  address text,
  city text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. CATEGORIES
create table if not exists public.categories (
  id text primary key,
  name text not null,
  icon text not null,
  sort_order integer default 0
);

-- 3. RESTAURANTS
create table if not exists public.restaurants (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  address text not null,
  neighborhood text not null,
  city text not null default 'São Paulo',
  category_id text references public.categories(id),
  image_url text not null,
  logo_url text not null,
  rating numeric(2,1) default 4.8,
  review_count integer default 120,
  delivery_time text default '30-45 min',
  delivery_fee numeric(10,2) default 5.90,
  is_open boolean default true,
  latitude double precision,
  longitude double precision,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. MENU ITEMS (Pratos / Produtos)
create table if not exists public.menu_items (
  id uuid default uuid_generate_v4() primary key,
  restaurant_id uuid references public.restaurants(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text not null,
  category text not null,
  is_available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ORDERS
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  restaurant_id uuid references public.restaurants(id) not null,
  total_amount numeric(10,2) not null,
  delivery_fee numeric(10,2) not null default 5.90,
  status text not null check (status in ('received', 'preparing', 'delivering', 'delivered', 'cancelled')) default 'received',
  delivery_address text not null,
  payment_method text not null check (payment_method in ('pix', 'credit_card', 'cash')),
  customer_name text not null,
  customer_phone text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. ORDER ITEMS
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  menu_item_id uuid references public.menu_items(id) not null,
  item_name text not null,
  unit_price numeric(10,2) not null,
  quantity integer not null default 1,
  total_price numeric(10,2) not null
);

-- 7. FAVORITES
create table if not exists public.favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  restaurant_id uuid references public.restaurants(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, restaurant_id)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.restaurants enable row level security;
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.favorites enable row level security;

-- Public read policies
create policy "Allow public read on categories" on public.categories for select using (true);
create policy "Allow public read on restaurants" on public.restaurants for select using (true);
create policy "Allow public read on menu_items" on public.menu_items for select using (true);

-- User specific policies
create policy "Allow users to view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Allow users to update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Allow users to view own orders" on public.orders for select using (auth.uid() = user_id or auth.uid() is null);
create policy "Allow users to insert orders" on public.orders for insert with check (true);

create policy "Allow users to view own order items" on public.order_items for select using (true);
create policy "Allow users to insert order items" on public.order_items for insert with check (true);

create policy "Allow users to manage favorites" on public.favorites for all using (auth.uid() = user_id or auth.uid() is null);

-- ==============================================================================
-- SEED DATA (Conforme Design Achou Food)
-- ==============================================================================
insert into public.categories (id, name, icon, sort_order) values
  ('todos', 'Todos', 'ForkKnife', 0),
  ('cafes', 'Cafés', 'Coffee', 1),
  ('sobremesas', 'Sobremesas', 'Cake', 2),
  ('hamburgueres', 'Hambúrgueres', 'Hamburger', 3),
  ('pizzas', 'Pizzas', 'Pizza', 4),
  ('japonesa', 'Japonesa', 'Fish', 5),
  ('bebidas', 'Bebidas', 'Wine', 6)
on conflict (id) do nothing;

insert into public.restaurants (id, name, description, address, neighborhood, category_id, image_url, logo_url, rating, review_count, delivery_time, delivery_fee, latitude, longitude) values
  ('11111111-1111-1111-1111-111111111111', 'Cafeteria das Nuvens', 'Especializada em cafés artesanais, bolos fofos e cupcakes decorados.', 'Avenida das Árvores, 655', 'Bairro Encantado', 'cafes', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=120&q=80', 4.9, 154, '20-30 min', 4.90, -23.55052, -46.633308),
  ('22222222-2222-2222-2222-222222222222', 'Doce Encanto Pâtisserie', 'Doces finos, tortas trufadas e os melhores cupcakes gourmet da cidade.', 'Rua dos Sonhos, 120', 'Jardins', 'sobremesas', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=120&q=80', 4.8, 98, '25-35 min', 5.50, -23.55352, -46.638308),
  ('33333333-3333-3333-3333-333333333333', 'Burger House Smash', 'Hambúrgueres artesanais na brasa, queijo cheddar derretido e batata rústica.', 'Alameda dos Sabores, 450', 'Vila Nova', 'hamburgueres', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=120&q=80', 4.7, 210, '30-40 min', 6.90, -23.54852, -46.630308),
  ('44444444-4444-4444-4444-444444444444', 'Nonna Bella Napoletana', 'Pizzas clássicas de fermentação natural de 48h no forno a lenha italiano.', 'Rua das Flores, 880', 'Bela Vista', 'pizzas', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=120&q=80', 4.9, 320, '35-45 min', 7.90, -23.55552, -46.640308)
on conflict (id) do nothing;

insert into public.menu_items (id, restaurant_id, name, description, price, image_url, category) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Cupcake de morango', 'Massa fofa de baunilha com recheio cremoso e cobertura leve de morangos frescos.', 12.90, 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=400&q=80', 'Doces'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Cappuccino Italiano', 'Espresso duplo com leite vaporizado aveludado e canela em pó.', 14.50, 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=400&q=80', 'Bebidas'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'Croissant de Amêndoas', 'Clássico folhado francês recheado com creme de amêndoas e lascas crocantes.', 16.90, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80', 'Padaria'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'Cheesecake de Frutas Vermelhas', 'Base crocante com massa cremosa de cream cheese e calda artesanal.', 19.90, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=400&q=80', 'Doces')
on conflict (id) do nothing;
