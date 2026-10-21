# Hotel De Blossom — quick handoff

**Guest website (Cloudflare Pages):** [hotel-de-blossom.pages.dev](https://hotel-de-blossom.pages.dev)

**Staff desk:** [hotel-de-blossom.pages.dev/staff/login](https://hotel-de-blossom.pages.dev/staff/login/)

**Custom domain:** `hoteldeblossom.com` still points to the separate legacy WordPress site; use the Pages links above for this application.

## Staff login and passwords

- Sign in with your approved work email and staff password. Access requires an active staff account.
- Passwords are managed in Supabase Auth. There is no password reset link on the login page; ask the hotel’s authorized administrator to reset access.
- Share passwords through the hotel’s password manager or another private channel. This handoff and the GitHub repository intentionally contain no passwords, recovery codes, or API keys.
- Receptionists handle enquiries. Managers and administrators can also update room rates.

## Guest booking flow

1. Guests choose **Stay**, **Group stay**, or **Event**. Stay requests include dates, guest count, and an optional room preference; event requests include the date, party size, and occasion.
2. They provide a name and phone/WhatsApp number, may add email or a note, agree to be contacted, and submit. The site returns a reference number.
3. Submission is a request only: it does not reserve a room or take payment. Reception checks availability and confirms the final tariff by phone or WhatsApp.
4. In the staff desk, review the request, update its status, add internal notes or a follow-up time, and use the scenario-based WhatsApp templates when contacting the guest. Mark it confirmed only after the guest and hotel agree.

## Rooms and current starting rates

| Room | Starting rate per night |
| --- | ---: |
| Deluxe | ₹7,500 |
| Twin Deluxe | ₹6,500 |
| Blossom Suite Room | ₹15,000 |
| Premium | ₹4,700 |

These are starting rates; managers/admins can change them in **Staff desk → Room rates**. Reception confirms availability, taxes, and the final quote with each guest.

## Fresh start and deployment

- The previous four production requests and their linked notes/events have been cleared. Four sent notification records remain as delivery history; they do not create guest requests. New submissions will receive fresh reference numbers.
- Website code is in GitHub; the production site is served through Cloudflare Pages. Do not put Cloudflare or Supabase credentials in source files or messages.
