-- Immutable webhook facts; RLS permits no public/customer access.
create table if not exists public.commerce_orders (
  checkout_session_id text primary key,
  payment_intent_id text not null unique,
  offer_slug text not null,
  offer_name text not null,
  catalog_version text not null,
  customer_email text,
  amount_subtotal bigint not null check (amount_subtotal > 0),
  amount_total bigint not null check (amount_total >= amount_subtotal),
  amount_tax bigint not null default 0 check (amount_tax >= 0),
  currency text not null check (currency = 'usd'),
  created_at timestamptz not null default now()
);
alter table public.commerce_orders enable row level security;
revoke all on public.commerce_orders from anon, authenticated;
grant select, insert on public.commerce_orders to service_role;

create table if not exists public.commerce_payment_adjustments (
  event_id text primary key,
  event_type text not null check (event_type in ('charge.refunded', 'charge.dispute.created')),
  payment_intent_id text not null,
  stripe_created_at bigint not null,
  created_at timestamptz not null default now()
);
create index if not exists commerce_payment_adjustments_intent_idx
  on public.commerce_payment_adjustments (payment_intent_id);
alter table public.commerce_payment_adjustments enable row level security;
revoke all on public.commerce_payment_adjustments from anon, authenticated;
grant select, insert on public.commerce_payment_adjustments to service_role;
