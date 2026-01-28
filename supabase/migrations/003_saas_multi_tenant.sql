-- Create profiles table for user information
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  company_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles RLS policies
create policy "Users can view their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Add new fields to clients table for enhanced tracking
alter table public.clients
add column if not exists client_type text default 'Lead' check (client_type in ('Lead', 'Data', 'Paying')),
add column if not exists website text,
add column if not exists notes text,
add column if not exists last_contact timestamptz,
add column if not exists source text;

-- Create index on client_type for faster filtering
create index if not exists idx_clients_type on public.clients(client_type);

-- Create index on user_id for faster queries (multi-tenant)
create index if not exists idx_clients_user_id on public.clients(user_id);

-- Function to automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, company_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'company_name', '')
  );
  return new;
end;
$$;

-- Trigger to create profile on user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

