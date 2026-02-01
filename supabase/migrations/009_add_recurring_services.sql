-- Add recurring billing + services details for paying clients
alter table public.clients
add column if not exists billing_type text default 'One-time'
  check (billing_type in ('One-time', 'Recurring')),
add column if not exists billing_frequency text,
add column if not exists recurring_amount numeric,
add column if not exists next_billing_date date,
add column if not exists services text;


