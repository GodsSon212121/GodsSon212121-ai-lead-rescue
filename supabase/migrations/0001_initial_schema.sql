-- AI Lead Rescue MVP schema
-- RLS policies are intentionally included as the tenant-isolation foundation.

create extension if not exists pgcrypto;

create table if not exists clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now()
);

create table if not exists staff_users (
  id uuid primary key references auth.users(id) on delete cascade,
  clinic_id uuid not null references clinics(id) on delete cascade,
  role text not null default 'staff' check (role in ('owner','admin','staff')),
  created_at timestamptz not null default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics(id) on delete cascade,
  session_id text,
  status text not null default 'open' check (status in ('open','resolved','escalated','abandoned')),
  lead_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics(id) on delete cascade,
  name text,
  email text,
  phone text,
  source text,
  created_at timestamptz not null default now()
);

alter table conversations
  add constraint conversations_lead_fk foreign key (lead_id) references leads(id) on delete set null;

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  clinic_id uuid not null references clinics(id) on delete cascade,
  sender_type text not null check (sender_type in ('patient','ai','staff','system')),
  content text not null,
  event_id text unique,
  created_at timestamptz not null default now()
);

create table if not exists appointment_requests (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics(id) on delete cascade,
  conversation_id uuid references conversations(id) on delete set null,
  lead_id uuid references leads(id) on delete set null,
  requested_date date,
  requested_time text,
  notes text,
  status text not null default 'pending' check (status in ('pending','confirmed','declined','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists escalations (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics(id) on delete cascade,
  conversation_id uuid not null references conversations(id) on delete cascade,
  reason text not null,
  status text not null default 'open' check (status in ('open','acknowledged','resolved')),
  created_at timestamptz not null default now()
);

create table if not exists knowledge_base (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references clinics(id) on delete cascade,
  title text not null,
  content text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references clinics(id) on delete cascade,
  actor_type text not null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_conversations_clinic on conversations(clinic_id);
create index if not exists idx_messages_conversation on messages(conversation_id, created_at);
create index if not exists idx_appointments_clinic_status on appointment_requests(clinic_id, status);
create index if not exists idx_escalations_clinic_status on escalations(clinic_id, status);
create index if not exists idx_knowledge_clinic_active on knowledge_base(clinic_id, is_active);

-- RLS foundation
alter table clinics enable row level security;
alter table staff_users enable row level security;
alter table conversations enable row level security;
alter table leads enable row level security;
alter table messages enable row level security;
alter table appointment_requests enable row level security;
alter table escalations enable row level security;
alter table knowledge_base enable row level security;
alter table audit_logs enable row level security;

create or replace function public.user_clinic_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select clinic_id from public.staff_users where id = auth.uid();
$$;

create policy staff_users_same_clinic on staff_users
  for select using (id = auth.uid() or clinic_id = public.user_clinic_id());

create policy clinics_staff_access on clinics
  for select using (id = public.user_clinic_id());

create policy conversations_staff_access on conversations
  for all using (clinic_id = public.user_clinic_id())
  with check (clinic_id = public.user_clinic_id());

create policy leads_staff_access on leads
  for all using (clinic_id = public.user_clinic_id())
  with check (clinic_id = public.user_clinic_id());

create policy messages_staff_access on messages
  for all using (clinic_id = public.user_clinic_id())
  with check (clinic_id = public.user_clinic_id());

create policy appointments_staff_access on appointment_requests
  for all using (clinic_id = public.user_clinic_id())
  with check (clinic_id = public.user_clinic_id());

create policy escalations_staff_access on escalations
  for all using (clinic_id = public.user_clinic_id())
  with check (clinic_id = public.user_clinic_id());

create policy knowledge_staff_access on knowledge_base
  for all using (clinic_id = public.user_clinic_id())
  with check (clinic_id = public.user_clinic_id());

create policy audit_staff_access on audit_logs
  for select using (clinic_id = public.user_clinic_id());
