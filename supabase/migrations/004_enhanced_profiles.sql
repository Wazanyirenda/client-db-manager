-- Add additional profile fields for SaaS personalization
alter table public.profiles
add column if not exists phone text,
add column if not exists industry text,
add column if not exists website text,
add column if not exists role text,
add column if not exists company_size text,
add column if not exists avatar_url text;

-- Backfill profile creation trigger to include new fields
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    company_name,
    phone,
    industry,
    website,
    role,
    company_size,
    avatar_url
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'company_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.raw_user_meta_data ->> 'industry', ''),
    coalesce(new.raw_user_meta_data ->> 'website', ''),
    coalesce(new.raw_user_meta_data ->> 'role', ''),
    coalesce(new.raw_user_meta_data ->> 'company_size', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  return new;
end;
$$;

