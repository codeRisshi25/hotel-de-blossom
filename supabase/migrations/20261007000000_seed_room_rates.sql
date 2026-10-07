-- The staff rate ledger and public /api/rates read from room_rates; seed the three room types
-- with the starting prices published on the website so reception can adjust them immediately.
insert into public.room_rates (room_type, base_nightly_inr)
values
  ('Deluxe Double', 7000),
  ('Deluxe Twin', 6500),
  ('Executive Suite', 15000)
on conflict (room_type) do nothing;
