create extension if not exists pgcrypto;

create sequence if not exists public.inquiry_reference_seq;

create type public.inquiry_purpose as enum ('stay', 'event', 'group_stay');
create type public.inquiry_status as enum ('new', 'contacted', 'provisional', 'confirmed', 'cancelled', 'closed');
create type public.staff_role as enum ('receptionist', 'manager', 'admin');
create type public.notification_status as enum ('pending', 'sending', 'sent', 'failed');

create table public.staff_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 120),
  role public.staff_role not null default 'receptionist',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  idempotency_key text not null unique check (char_length(idempotency_key) between 16 and 160),
  purpose public.inquiry_purpose not null,
  check_in date,
  check_out date,
  guests smallint not null default 1 check (guests between 1 and 100),
  room_type text check (room_type is null or char_length(room_type) <= 120),
  guest_name text not null check (char_length(guest_name) between 1 and 120),
  phone text not null check (char_length(phone) between 7 and 32),
  email text check (email is null or char_length(email) <= 254),
  message text check (message is null or char_length(message) <= 4000),
  consent_at timestamptz not null,
  source text not null default 'website' check (char_length(source) between 1 and 32),
  status public.inquiry_status not null default 'new',
  assigned_to uuid references public.staff_profiles(user_id) on delete set null,
  follow_up_at timestamptz,
  internal_notes text check (internal_notes is null or char_length(internal_notes) <= 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (check_in is null or check_out is null or check_out > check_in)
);

create table public.inquiry_notes (
  id uuid primary key default gen_random_uuid(),
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  author_user_id uuid not null references public.staff_profiles(user_id) on delete restrict,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

create table public.inquiry_events (
  id bigint generated always as identity primary key,
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  event_type text not null check (event_type in ('created', 'status_changed', 'assigned', 'follow_up_changed', 'note_added')),
  actor_user_id uuid references public.staff_profiles(user_id) on delete set null,
  from_status public.inquiry_status,
  to_status public.inquiry_status,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.notification_outbox (
  id uuid primary key default gen_random_uuid(),
  dedupe_key text not null unique,
  kind text not null check (kind in ('reception_new_inquiry')),
  payload jsonb not null,
  status public.notification_status not null default 'pending',
  attempts smallint not null default 0 check (attempts between 0 and 20),
  available_at timestamptz not null default now(),
  lease_until timestamptz,
  lease_token uuid,
  last_error text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index inquiries_created_at_idx on public.inquiries (created_at desc, id desc);
create index inquiries_status_created_at_idx on public.inquiries (status, created_at desc, id desc);
create index inquiries_assigned_status_idx on public.inquiries (assigned_to, status, created_at desc);
create index inquiries_follow_up_idx on public.inquiries (follow_up_at) where follow_up_at is not null and status not in ('closed', 'cancelled');
create index inquiry_notes_inquiry_created_idx on public.inquiry_notes (inquiry_id, created_at desc);
create index inquiry_events_inquiry_created_idx on public.inquiry_events (inquiry_id, created_at desc);
create index notification_outbox_ready_idx on public.notification_outbox (available_at, created_at)
  where status in ('pending', 'failed');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger staff_profiles_set_updated_at
before update on public.staff_profiles
for each row execute function public.set_updated_at();

create trigger inquiries_set_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();

create trigger notification_outbox_set_updated_at
before update on public.notification_outbox
for each row execute function public.set_updated_at();

create or replace function public.is_active_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.staff_profiles
    where user_id = auth.uid() and is_active = true
  );
$$;

create or replace function public.record_inquiry_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := coalesce(nullif(current_setting('app.actor_user_id', true), '')::uuid, auth.uid());
begin
  if tg_op = 'INSERT' then
    insert into public.inquiry_events (inquiry_id, event_type, actor_user_id, to_status, metadata)
    values (new.id, 'created', actor, new.status, jsonb_build_object('source', new.source));
    return new;
  end if;

  if old.status is distinct from new.status then
    insert into public.inquiry_events (inquiry_id, event_type, actor_user_id, from_status, to_status)
    values (new.id, 'status_changed', actor, old.status, new.status);
  end if;

  if old.assigned_to is distinct from new.assigned_to then
    insert into public.inquiry_events (inquiry_id, event_type, actor_user_id, metadata)
    values (new.id, 'assigned', actor, jsonb_build_object('assigned_to', new.assigned_to));
  end if;

  if old.follow_up_at is distinct from new.follow_up_at then
    insert into public.inquiry_events (inquiry_id, event_type, actor_user_id, metadata)
    values (new.id, 'follow_up_changed', actor, jsonb_build_object('follow_up_at', new.follow_up_at));
  end if;

  return new;
end;
$$;

create or replace function public.record_inquiry_note_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.inquiry_events (inquiry_id, event_type, actor_user_id, metadata)
  values (new.inquiry_id, 'note_added', new.author_user_id, jsonb_build_object('note_id', new.id));
  return new;
end;
$$;

create trigger inquiries_record_event
after insert or update of status, assigned_to, follow_up_at on public.inquiries
for each row execute function public.record_inquiry_event();

create trigger inquiry_notes_record_event
after insert on public.inquiry_notes
for each row execute function public.record_inquiry_note_event();

create or replace function public.create_public_inquiry(p_payload jsonb, p_request_id text)
returns table (inquiry_id uuid, reference text, status public.inquiry_status)
language plpgsql
security definer
set search_path = public
as $$
declare
  existing public.inquiries;
  new_id uuid;
  new_reference text;
  new_status public.inquiry_status;
begin
  select * into existing from public.inquiries where idempotency_key = p_request_id;
  if found then
    return query select existing.id, existing.reference_code, existing.status;
    return;
  end if;

  new_id := gen_random_uuid();
  new_reference := 'HDB-' || to_char(current_date, 'YYYY') || '-' || lpad(nextval('public.inquiry_reference_seq')::text, 6, '0');
  new_status := 'new';

  insert into public.inquiries (
    id, reference_code, idempotency_key, purpose, check_in, check_out, guests,
    room_type, guest_name, phone, email, message, consent_at, source, status
  ) values (
    new_id,
    new_reference,
    p_request_id,
    (p_payload ->> 'purpose')::public.inquiry_purpose,
    nullif(p_payload ->> 'checkIn', '')::date,
    nullif(p_payload ->> 'checkOut', '')::date,
    coalesce(nullif(p_payload ->> 'guests', '')::smallint, 1),
    nullif(p_payload ->> 'roomType', ''),
    p_payload ->> 'name',
    p_payload ->> 'phone',
    nullif(p_payload ->> 'email', ''),
    nullif(p_payload ->> 'message', ''),
    now(),
    coalesce(nullif(p_payload ->> 'source', ''), 'website'),
    new_status
  );

  insert into public.notification_outbox (dedupe_key, kind, payload)
  values (
    'reception-new-inquiry:' || new_id::text,
    'reception_new_inquiry',
    jsonb_build_object(
      'inquiryId', new_id,
      'reference', new_reference,
      'purpose', p_payload ->> 'purpose',
      'checkIn', p_payload ->> 'checkIn',
      'checkOut', p_payload ->> 'checkOut',
      'guests', p_payload ->> 'guests',
      'roomType', p_payload ->> 'roomType',
      'name', p_payload ->> 'name',
      'phone', p_payload ->> 'phone',
      'email', p_payload ->> 'email',
      'message', p_payload ->> 'message'
    )
  );

  return query select new_id, new_reference, new_status;
end;
$$;

create or replace function public.update_inquiry_as_staff(
  p_id uuid,
  p_actor_user_id uuid,
  p_status public.inquiry_status default null,
  p_assigned_to uuid default null,
  p_has_assigned_to boolean default false,
  p_follow_up_at timestamptz default null,
  p_has_follow_up_at boolean default false
)
returns setof public.inquiries
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_inquiry public.inquiries;
begin
  if not exists (
    select 1 from public.staff_profiles
    where user_id = p_actor_user_id and is_active = true
  ) then
    raise exception 'staff access required' using errcode = '42501';
  end if;

  if p_has_assigned_to and p_assigned_to is not null and not exists (
    select 1 from public.staff_profiles
    where user_id = p_assigned_to and is_active = true
  ) then
    raise exception 'assignee must be active staff' using errcode = '22023';
  end if;

  perform set_config('app.actor_user_id', p_actor_user_id::text, true);

  update public.inquiries
  set status = coalesce(p_status, status),
      assigned_to = case when p_has_assigned_to then p_assigned_to else assigned_to end,
      follow_up_at = case when p_has_follow_up_at then p_follow_up_at else follow_up_at end
  where id = p_id
  returning * into updated_inquiry;

  if found then
    return next updated_inquiry;
  end if;
end;
$$;

create or replace function public.claim_notification_batch(p_limit integer default 10)
returns setof public.notification_outbox
language sql
security definer
set search_path = public
as $$
  with candidates as (
    select id
    from public.notification_outbox
    where (status = 'pending' or (status = 'failed' and available_at <= now()) or (status = 'sending' and lease_until < now()))
      and attempts < 20
      and available_at <= now()
    order by created_at
    for update skip locked
    limit greatest(1, least(coalesce(p_limit, 10), 50))
  )
  update public.notification_outbox as outbox
  set status = 'sending',
      attempts = outbox.attempts + 1,
      lease_until = now() + interval '2 minutes',
      lease_token = gen_random_uuid(),
      last_error = null
  from candidates
  where outbox.id = candidates.id
  returning outbox.*;
$$;

create or replace function public.mark_notification_sent(p_id uuid, p_lease_token uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.notification_outbox
  set status = 'sent', sent_at = now(), lease_until = null, lease_token = null
  where id = p_id and status = 'sending' and lease_token = p_lease_token;
$$;

create or replace function public.mark_notification_failed(p_id uuid, p_lease_token uuid, p_error text, p_retry_at timestamptz)
returns void
language sql
security definer
set search_path = public
as $$
  update public.notification_outbox
  set status = 'failed', last_error = left(p_error, 1000), available_at = p_retry_at, lease_until = null, lease_token = null
  where id = p_id and status = 'sending' and lease_token = p_lease_token;
$$;

alter table public.staff_profiles enable row level security;
alter table public.inquiries enable row level security;
alter table public.inquiry_notes enable row level security;
alter table public.inquiry_events enable row level security;
alter table public.notification_outbox enable row level security;

revoke all on sequence public.inquiry_reference_seq from public, anon, authenticated;

create policy staff_profiles_read_staff on public.staff_profiles
for select to authenticated using (public.is_active_staff());

create policy inquiries_read_staff on public.inquiries
for select to authenticated using (public.is_active_staff());

create policy inquiries_update_staff on public.inquiries
for update to authenticated using (public.is_active_staff()) with check (public.is_active_staff());

create policy inquiry_notes_read_staff on public.inquiry_notes
for select to authenticated using (public.is_active_staff());

create policy inquiry_notes_create_staff on public.inquiry_notes
for insert to authenticated with check (public.is_active_staff() and author_user_id = auth.uid());

create policy inquiry_events_read_staff on public.inquiry_events
for select to authenticated using (public.is_active_staff());

revoke all on public.staff_profiles, public.inquiries, public.inquiry_notes, public.inquiry_events, public.notification_outbox from anon, authenticated;
revoke all on function public.create_public_inquiry(jsonb, text) from public, anon, authenticated;
revoke all on function public.update_inquiry_as_staff(uuid, uuid, public.inquiry_status, uuid, boolean, timestamptz, boolean) from public, anon, authenticated;
revoke all on function public.claim_notification_batch(integer) from public, anon, authenticated;
revoke all on function public.mark_notification_sent(uuid, uuid) from public, anon, authenticated;
revoke all on function public.mark_notification_failed(uuid, uuid, text, timestamptz) from public, anon, authenticated;

grant execute on function public.create_public_inquiry(jsonb, text) to service_role;
grant execute on function public.update_inquiry_as_staff(uuid, uuid, public.inquiry_status, uuid, boolean, timestamptz, boolean) to service_role;
grant execute on function public.claim_notification_batch(integer) to service_role;
grant execute on function public.mark_notification_sent(uuid, uuid) to service_role;
grant execute on function public.mark_notification_failed(uuid, uuid, text, timestamptz) to service_role;
