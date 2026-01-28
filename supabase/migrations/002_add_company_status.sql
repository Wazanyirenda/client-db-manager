-- Add company and status fields to clients table
alter table public.clients
add column if not exists company text,
add column if not exists status text default 'Active';

-- Create index on status for faster filtering
create index if not exists idx_clients_status on public.clients(status);

-- Create index on company for faster searching
create index if not exists idx_clients_company on public.clients(company);


