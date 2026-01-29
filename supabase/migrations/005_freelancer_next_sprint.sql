-- Freelancer-focused "best next sprint" additions:
-- - Pipeline stages + follow-up dates
-- - Invoice tracking fields
-- - Tasks/reminders

-- Add pipeline + follow-up + invoice fields to clients
alter table public.clients
add column if not exists pipeline_stage text default 'Inquiry'
  check (pipeline_stage in ('Inquiry', 'Contacted', 'Proposal', 'Won', 'Lost')),
add column if not exists next_follow_up timestamptz,
add column if not exists deal_value numeric,
add column if not exists invoice_status text default 'Unpaid'
  check (invoice_status in ('Unpaid', 'Paid', 'Overdue')),
add column if not exists invoice_due_date date;

create index if not exists idx_clients_pipeline_stage on public.clients(pipeline_stage);
create index if not exists idx_clients_next_follow_up on public.clients(next_follow_up);
create index if not exists idx_clients_invoice_status on public.clients(invoice_status);

-- Tasks/reminders (owned by user, optionally linked to a client)
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  due_at timestamptz,
  completed boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.tasks enable row level security;

create policy "Tasks are only visible to their owner"
  on public.tasks
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on public.tasks
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks
  for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks
  for delete
  using (auth.uid() = user_id);

create index if not exists idx_tasks_user_id on public.tasks(user_id);
create index if not exists idx_tasks_due_at on public.tasks(due_at);
create index if not exists idx_tasks_completed on public.tasks(completed);

