-- ==============================================================================
-- ACHOU FOOD - SUPABASE POSTGRESQL SCHEMA COMPLETO
-- Compatível com o app Achou Food (Canela - RS)
-- ==============================================================================

-- 1. LIMPEZA DE TABELAS ANTERIORES COM TIPAGEM INCOMPATÍVEL (Se existirem)
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.favorites cascade;
drop table if exists public.menu_items cascade;
drop table if exists public.restaurants cascade;
drop table if exists public.categories cascade;

-- 2. EXTENSÃO UUID
create extension if not exists "uuid-ossp";

-- 3. TABELA DE PERFIS DE USUÁRIOS
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  address text,
  city text default 'Canela - RS',
  role text default 'customer',
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Remove restrições de NOT NULL de colunas antigas que possam bloquear cadastros
alter table if exists public.profiles alter column phone drop not null;
alter table if exists public.profiles alter column first_name drop not null;
alter table if exists public.profiles alter column last_name drop not null;

-- 4. TABELA DE CATEGORIAS (id text para compatibilidade com o frontend)
create table public.categories (
  id text primary key,
  name text not null,
  icon text not null,
  sort_order integer default 0
);

-- 5. TABELA DE RESTAURANTES (Canela, RS)
create table public.restaurants (
  id text primary key,
  name text not null,
  description text,
  address text not null,
  neighborhood text not null,
  city text not null default 'Canela - RS',
  category_id text,
  image_url text not null,
  logo_url text,
  rating numeric(2,1) default 4.9,
  review_count integer default 140,
  delivery_time text default '20-30 min',
  delivery_fee numeric(10,2) default 4.90,
  is_open boolean default true,
  latitude double precision not null,
  longitude double precision not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. TABELA DE PRODUTOS / ITENS DO CARDÁPIO
create table public.menu_items (
  id text primary key,
  restaurant_id text references public.restaurants(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text not null,
  category text not null,
  is_available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. TABELA DE PEDIDOS
create table public.orders (
  id text primary key default ('ord-' || floor(random() * 9000 + 1000)::text),
  user_id uuid references auth.users(id),
  restaurant_id text references public.restaurants(id) not null,
  total_amount numeric(10,2) not null,
  delivery_fee numeric(10,2) not null default 0.00,
  status text not null check (status in ('received', 'preparing', 'delivering', 'delivered', 'cancelled')) default 'received',
  delivery_address text not null,
  payment_method text not null check (payment_method in ('pix', 'credit_card', 'cash')),
  customer_name text not null,
  customer_phone text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. TABELA DE ITENS DO PEDIDO
create table public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id text references public.orders(id) on delete cascade not null,
  menu_item_id text,
  item_name text not null,
  unit_price numeric(10,2) not null,
  quantity integer not null default 1,
  total_price numeric(10,2) not null
);

-- 9. TABELA DE FAVORITOS
create table public.favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  restaurant_id text references public.restaurants(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, restaurant_id)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.restaurants enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.favorites enable row level security;

-- Políticas de Leitura Pública
create policy "Allow public read on categories" on public.categories for select using (true);
create policy "Allow public read on restaurants" on public.restaurants for select using (true);
create policy "Allow public read on menu_items" on public.menu_items for select using (true);

-- Políticas de Usuário & Pedidos
create policy "Allow public insert on orders" on public.orders for insert with check (true);
create policy "Allow public select on orders" on public.orders for select using (true);
create policy "Allow public insert on order_items" on public.order_items for insert with check (true);
create policy "Allow public select on order_items" on public.order_items for select using (true);
create policy "Allow users to view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Allow users to update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Allow users to manage favorites" on public.favorites for all using (true);

-- ==============================================================================
-- DADOS INICIAIS (SEEDS) - CANELA, RS
-- ==============================================================================

-- Categorias
insert into public.categories (id, name, icon, sort_order) values
  ('todos', 'Todos', 'ForkKnife', 0),
  ('cafes', 'Cafés', 'Coffee', 1),
  ('sobremesas', 'Sobremesas', 'Cake', 2),
  ('hamburgueres', 'Hambúrgueres', 'Hamburger', 3),
  ('pizzas', 'Pizzas', 'Pizza', 4),
  ('japonesa', 'Japonesa', 'Fish', 5),
  ('bebidas', 'Bebidas', 'Wine', 6)
on conflict (id) do nothing;

-- Restaurantes de Canela, RS
insert into public.restaurants (id, name, description, address, neighborhood, city, category_id, image_url, logo_url, rating, review_count, delivery_time, delivery_fee, is_open, latitude, longitude) values
  ('rest-doce-aroma', 'Doce Aroma', 'Oferecemos uma variedade de doces, incluindo bolos personalizados, cupcakes e doces artesanais. Cada produto é feito com ingredientes frescos, garantindo sabor e apresentação excepcionais.', 'Rua das Palmeiras, 321', 'Vila dos Aromas', 'Canela - RS', 'sobremesas', 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=800&q=80', '', 4.9, 142, '20-30 min', 4.90, true, -29.3644, -50.8143),
  ('rest-sabor-arte', 'Restaurante Sabor & Arte', 'Culinária contemporânea, pratos executivos gourmet e gastronomia afetiva.', 'Rua do Comércio, 654', 'Vila Gourmet', 'Canela - RS', 'refeicoes', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', '', 4.8, 230, '30-40 min', 5.90, true, -29.3621, -50.8102),
  ('rest-bistro-pao', 'Bistrô do Pão', 'Pães de fermentação natural, croissants folhados e cafés especiais.', 'Avenida Central, 456', 'Bairro do Sabor', 'Canela - RS', 'padaria', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', '', 4.9, 185, '15-25 min', 0.00, true, -29.3615, -50.8125),
  ('rest-cafeteria-vale', 'Cafeteria do Vale', 'Cafés especiais coados, cappuccinos cremosos e fatias de bolos caseiros.', 'Rua das Flores, 123', 'Jardim das Delícias', 'Canela - RS', 'cafes', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80', '', 4.7, 96, '20-30 min', 3.90, true, -29.3658, -50.8162),
  ('rest-sabor-tropical', 'Sabor Tropical', 'Sucos naturais, bowls de açaí puro, saladas frescas e sanduíches naturais.', 'Avenida das Flores, 45', 'Jardim das Delícias', 'Canela - RS', 'sucos', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', '', 4.8, 114, '25-35 min', 4.50, true, -29.3670, -50.8150),
  ('rest-hamburger-esquina', 'Hamburger da Esquina', 'Burgers artesanais smash grelhados na brasa com queijo cheddar autêntico.', 'Praça da Paz, 789', 'Centro Histórico', 'Canela - RS', 'hamburgueres', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', '', 4.9, 310, '25-35 min', 6.00, true, -29.3601, -50.8130),
  ('rest-cafeteria-nuvens', 'Cafeteria das Nuvens', 'Especializada em cafés artesanais, bolos fofos e cupcakes decorados.', 'Avenida das Árvores, 450', 'Bairro Encantado', 'Canela - RS', 'cafes', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80', '', 4.9, 154, '20-30 min', 4.90, true, -29.3590, -50.8180),
  ('rest-veg-cia', 'Veg & Cia', 'Culinária 100% vegetariana e vegana, pratos coloridos, nutritivos e saborosos.', 'Rua dos Manacás, 12', 'Vila das Flores', 'Canela - RS', 'vegetariano', 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80', '', 4.9, 88, '20-30 min', 5.00, true, -29.3635, -50.8195)
on conflict (id) do nothing;

-- Cardápio do Doce Aroma
insert into public.menu_items (id, restaurant_id, name, description, price, image_url, category, is_available) values
  ('item-da-1', 'rest-doce-aroma', 'Cupcake de morango', 'Massa fofa de baunilha com recheio cremoso e cobertura leve de morangos frescos.', 12.90, 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=400&q=80', 'Cupcakes', true),
  ('item-da-2', 'rest-doce-aroma', 'Cupcake de brigadeiro', 'Massa de chocolate belga 50% cacau com generoso recheio e cobertura de brigadeiro tradicional.', 10.90, 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=400&q=80', 'Cupcakes', true),
  ('item-da-3', 'rest-doce-aroma', 'Cupcake de nozes', 'Massa aromática de especiarias e nozes com creme suave de baunilha e noz caramelizada.', 16.00, 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=400&q=80', 'Cupcakes', true),
  ('item-da-4', 'rest-doce-aroma', 'Bolo de cenoura com brigadeiro', 'Fatia fofinha de bolo caseiro de cenoura coberta com calda brilhante de brigadeiro.', 15.90, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80', 'Bolos e Tortas', true),
  ('item-da-5', 'rest-doce-aroma', 'Bolo red velvet', 'Camadas aveludadas de bolo red velvet recheadas com autêntico frosting de cream cheese.', 21.00, 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=400&q=80', 'Bolos e Tortas', true),
  ('item-da-6', 'rest-doce-aroma', 'Torta de morango com chantily', 'Massa sablée crocante, creme pâtissière leve, morangos frescos e chantilly fresco.', 17.50, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=400&q=80', 'Bolos e Tortas', true),
  ('item-da-7', 'rest-doce-aroma', 'Café expresso', 'Grãos selecionados moídos na hora com crema densa e aroma marcante.', 8.00, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80', 'Bebidas', true),
  ('item-da-8', 'rest-doce-aroma', 'Cappuccino artesanal', 'Espresso duplo com leite vaporizado e chocolate em pó polvilhado.', 14.00, 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=400&q=80', 'Bebidas', true)
on conflict (id) do nothing;
