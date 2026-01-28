create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  address text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.clients enable row level security;

create policy "Clients are only visible to their owner"
  on public.clients
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own clients"
  on public.clients
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own clients"
  on public.clients
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own clients"
  on public.clients
  for delete
  using (auth.uid() = user_id);


