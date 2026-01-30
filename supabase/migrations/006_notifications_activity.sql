-- Notifications table
-- Stores user notifications for tasks, follow-ups, and other alerts

create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null, -- 'task_due', 'task_overdue', 'follow_up_due', 'invoice_overdue', 'no_contact'
  title text not null,
  message text,
  read boolean default false,
  client_id uuid references public.clients(id) on delete set null,
  task_id uuid references public.tasks(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.notifications enable row level security;

-- Policies: users can only see their own notifications
create policy "Users can view their own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update their own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Users can delete their own notifications"
  on public.notifications for delete
  using (auth.uid() = user_id);

create policy "Users can insert their own notifications"
  on public.notifications for insert
  with check (auth.uid() = user_id);

-- Indexes for faster queries
create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists notifications_read_idx on public.notifications(read);
create index if not exists notifications_created_at_idx on public.notifications(created_at desc);


-- Activity logs table
-- Tracks user actions for audit trail

create table if not exists public.activity_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null, -- 'client_created', 'client_updated', 'client_deleted', 'task_created', 'task_completed', 'login', 'logout', 'profile_updated', 'data_exported'
  entity_type text, -- 'client', 'task', 'profile', etc.
  entity_id uuid, -- ID of the affected entity
  entity_name text, -- Name of the affected entity (for display)
  metadata jsonb default '{}', -- Additional context (old values, new values, etc.)
  ip_address text,
  user_agent text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.activity_logs enable row level security;

-- Policies: users can only see their own activity
create policy "Users can view their own activity"
  on public.activity_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own activity"
  on public.activity_logs for insert
  with check (auth.uid() = user_id);

-- Indexes for faster queries
create index if not exists activity_logs_user_id_idx on public.activity_logs(user_id);
create index if not exists activity_logs_action_idx on public.activity_logs(action);
create index if not exists activity_logs_entity_type_idx on public.activity_logs(entity_type);
create index if not exists activity_logs_created_at_idx on public.activity_logs(created_at desc);


-- Function to update updated_at timestamp
create or replace function update_notifications_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update updated_at
drop trigger if exists notifications_updated_at on public.notifications;
create trigger notifications_updated_at
  before update on public.notifications
  for each row
  execute function update_notifications_updated_at();

