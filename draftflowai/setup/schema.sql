-- DraftflowAI 3.0: apply once in a NEW dedicated Supabase project.
-- No sample customer records and no API credentials included.
begin;
create table public.customer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 100),
  target_role text not null default '' check (char_length(target_role) <= 150),
  preferred_location text not null default '' check (char_length(preferred_location) <= 150),
  created_at timestamptz not null default now()
);
create table public.application_updates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company text not null check (char_length(company) between 1 and 200),
  target_role text not null check (char_length(target_role) between 1 and 200),
  outreach_date date not null default current_date,
  channel text not null default 'Email' check (channel in ('Email','LinkedIn','Career portal','Other')),
  status text not null default 'To review' check (status in ('To review','Sent','Reply received','Interview','Closed')),
  notes text not null default '' check (char_length(notes) <= 1000),
  created_at timestamptz not null default now()
);
create index application_updates_customer_date on public.application_updates(user_id,outreach_date desc,id);
alter table public.customer_profiles enable row level security;
alter table public.application_updates enable row level security;
revoke all on public.customer_profiles,public.application_updates from public,anon,authenticated;
grant select on public.customer_profiles,public.application_updates to authenticated;
grant insert(user_id,display_name,target_role,preferred_location) on public.customer_profiles to authenticated;
grant update(display_name,target_role,preferred_location) on public.customer_profiles to authenticated;
create policy "Read own profile" on public.customer_profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own profile" on public.customer_profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Edit own preferences" on public.customer_profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Read own application updates" on public.application_updates for select to authenticated using ((select auth.uid()) = user_id);
-- Customers cannot insert, update, or delete staff-managed application records.
-- Authorized staff initially manage entries via the restricted Supabase dashboard.
commit;
