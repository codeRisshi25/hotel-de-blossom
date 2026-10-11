-- Apply the newly approved published starting rate to the existing staff-managed row.
update public.room_rates
set base_nightly_inr = 7500
where room_type = 'Deluxe Double'
  and base_nightly_inr <> 7500;
