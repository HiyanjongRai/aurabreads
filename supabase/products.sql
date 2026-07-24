create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id text not null,
  seller_name text not null,
  name text not null,
  sku text,
  category text not null,
  short_description text,
  description text,
  regular_price numeric(12, 2) not null check (regular_price >= 0),
  sale_price numeric(12, 2) check (sale_price is null or sale_price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  status text not null default 'draft' check (status in ('active', 'draft', 'archived')),
  featured boolean not null default false,
  track_inventory boolean not null default true,
  material text,
  color_finish text,
  collection text,
  primary_image_url text not null,
  images jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_seller_id_idx on public.products (seller_id);
create index if not exists products_status_idx on public.products (status);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_featured_idx on public.products (featured);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

alter table public.products enable row level security;

drop policy if exists "Products are readable" on public.products;
create policy "Products are readable"
on public.products for select
using (true);

drop policy if exists "Service role manages products" on public.products;
create policy "Service role manages products"
on public.products for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
