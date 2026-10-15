-- Standardise room names used by the site, enquiries, rates, and staff dashboard.
-- Existing staff-edited rates win when a canonical row already exists; legacy
-- duplicates are kept for history but deactivated.
do $$
declare
  mapping record;
begin
  for mapping in
    select * from (values
      ('Deluxe Double', 'Deluxe', 7500),
      ('Deluxe Twin', 'Twin Deluxe', 6500),
      ('Executive Suite', 'Blossom Suite Room', 15000)
    ) as room_types(old_name, new_name, starting_rate)
  loop
    if exists (select 1 from public.room_rates where room_type = mapping.old_name) then
      if exists (select 1 from public.room_rates where room_type = mapping.new_name) then
        update public.room_rates
        set is_active = false
        where room_type = mapping.old_name;
      else
        update public.room_rates
        set room_type = mapping.new_name
        where room_type = mapping.old_name;
      end if;
    else
      insert into public.room_rates (room_type, base_nightly_inr)
      values (mapping.new_name, mapping.starting_rate)
      on conflict (room_type) do nothing;
    end if;
  end loop;
end;
$$;

-- Provisional display rate requested for launch; staff can change it in the dashboard.
insert into public.room_rates (room_type, base_nightly_inr)
values ('Premium', 9999)
on conflict (room_type) do nothing;

-- Keep historical enquiries readable with the current public room names.
update public.inquiries
set room_type = case room_type
  when 'Deluxe Double' then 'Deluxe'
  when 'Deluxe Twin' then 'Twin Deluxe'
  when 'Executive Suite' then 'Blossom Suite Room'
end
where room_type in ('Deluxe Double', 'Deluxe Twin', 'Executive Suite');
