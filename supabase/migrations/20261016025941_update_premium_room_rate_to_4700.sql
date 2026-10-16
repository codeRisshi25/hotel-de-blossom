-- Replace the provisional Premium rate with the approved nightly tariff.
update public.room_rates
set base_nightly_inr = 4700,
    updated_at = now()
where room_type = 'Premium'
  and is_active = true;
