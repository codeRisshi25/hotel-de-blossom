create table public.room_rates (
  id uuid primary key default gen_random_uuid(),
  room_type text not null unique check (char_length(room_type) between 1 and 120),
  base_nightly_inr integer not null check (base_nightly_inr >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.room_rates enable row level security;
revoke all on table public.room_rates from public, anon, authenticated;
grant select, insert, update, delete on table public.room_rates to service_role;
create trigger room_rates_set_updated_at before update on public.room_rates for each row execute function public.set_updated_at();
alter table public.inquiries add column if not exists archived_at timestamptz;
alter table public.inquiries add column if not exists archived_by uuid references public.staff_profiles(user_id) on delete set null;
create index if not exists inquiries_archived_idx on public.inquiries (archived_at);
alter table public.inquiry_events drop constraint if exists inquiry_events_event_type_check;
alter table public.inquiry_events add constraint inquiry_events_event_type_check check (event_type in ('created','status_changed','assigned','follow_up_changed','note_added','archived','unarchived'));
create policy room_rates_read_staff on public.room_rates for select to authenticated using ((select public.is_active_staff()) and is_active = true);
create policy room_rates_update_managers on public.room_rates for update to authenticated using (exists (select 1 from public.staff_profiles where user_id=auth.uid() and is_active and role in ('manager','admin'))) with check (exists (select 1 from public.staff_profiles where user_id=auth.uid() and is_active and role in ('manager','admin')));
create or replace function public.archive_inquiry_as_staff(p_id uuid, p_actor_user_id uuid, p_archived boolean)
returns setof public.inquiries language plpgsql security definer set search_path=public as $$
declare r public.inquiries;
begin
 if not exists(select 1 from staff_profiles where user_id=p_actor_user_id and is_active) then raise exception 'staff access required' using errcode='42501'; end if;
 update inquiries set archived_at=case when p_archived then now() else null end, archived_by=case when p_archived then p_actor_user_id else null end
 where id=p_id and status in ('closed','cancelled') returning * into r;
 if r.id is null then return; end if;
 insert into inquiry_events(inquiry_id,event_type,actor_user_id,metadata) values(r.id,case when p_archived then 'archived' else 'unarchived' end,p_actor_user_id,'{}'::jsonb);
 return next r;
end; $$;
revoke all on function public.archive_inquiry_as_staff(uuid, uuid, boolean) from public, anon, authenticated;
grant execute on function public.archive_inquiry_as_staff(uuid, uuid, boolean) to service_role;
