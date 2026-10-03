create index if not exists inquiry_notes_author_user_idx
  on public.inquiry_notes (author_user_id);

create index if not exists inquiry_events_actor_user_idx
  on public.inquiry_events (actor_user_id);

drop policy if exists staff_profiles_read_staff on public.staff_profiles;
create policy staff_profiles_read_staff on public.staff_profiles
for select to authenticated using ((select public.is_active_staff()));

drop policy if exists inquiries_read_staff on public.inquiries;
create policy inquiries_read_staff on public.inquiries
for select to authenticated using ((select public.is_active_staff()));

drop policy if exists inquiries_update_staff on public.inquiries;
create policy inquiries_update_staff on public.inquiries
for update to authenticated
using ((select public.is_active_staff()))
with check ((select public.is_active_staff()));

drop policy if exists inquiry_notes_read_staff on public.inquiry_notes;
create policy inquiry_notes_read_staff on public.inquiry_notes
for select to authenticated using ((select public.is_active_staff()));

drop policy if exists inquiry_notes_create_staff on public.inquiry_notes;
create policy inquiry_notes_create_staff on public.inquiry_notes
for insert to authenticated
with check ((select public.is_active_staff()) and author_user_id = (select auth.uid()));

drop policy if exists inquiry_events_read_staff on public.inquiry_events;
create policy inquiry_events_read_staff on public.inquiry_events
for select to authenticated using ((select public.is_active_staff()));

create policy notification_outbox_no_direct_access on public.notification_outbox
for all to anon, authenticated
using (false)
with check (false);

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.is_active_staff() from public, anon, authenticated;
revoke all on function public.record_inquiry_event() from public, anon, authenticated;
revoke all on function public.record_inquiry_note_event() from public, anon, authenticated;
