# Hotel De Blossom backend setup

This repository now contains the fixed-scope enquiry backend for Hotel De Blossom:

1. Guest submits a stay, event, or group-stay enquiry.
2. Supabase stores it atomically and returns an `HDB-YYYY-NNNNNN` reference.
3. A reception notification is placed in an outbox.
4. A protected drain endpoint delivers the notification email.
5. Authenticated staff can list, update, assign, annotate, and review enquiry history.

The public site never receives the Supabase service-role key. All database access goes through the server functions.

## Asset storage and CDN

The current image files in `public/images` are already served through the Cloudflare Pages edge cache. For a shared hotel media library, create one public Supabase Storage bucket named `hotel-assets` and upload files using the same `images/...` paths as the local fallback.

Supabase public Storage objects are CDN-cached. The free plan currently includes 1 GB of storage, which is sufficient for the current hotel image set. Set this public, non-secret build variable when the bucket is ready:

```text
PUBLIC_ASSET_BASE_URL=https://<project-ref>.supabase.co/storage/v1/object/public/hotel-assets
```

The asset resolver in `src/site/assets.ts` uses that base URL when configured and falls back to the local `/images/...` paths otherwise. Do not put private bucket URLs, service keys, or upload credentials in the frontend. Use stable filenames and replace assets with new filenames when the image changes so old CDN responses remain valid.

## Local verification

```sh
npm install
npm run typecheck
```

The current typecheck covers all API functions and server modules. The old plain HTML prototype is archived under `legacy/plain-html-prototype/`; the production frontend will follow `HOTEL_DE_BLOSSOM_MASTER_PLAN.md`.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/20261003000000_initial_enquiries.sql` in the Supabase SQL editor or through the Supabase CLI.
3. Enable the Supabase Auth method used for the staff dashboard.
4. Create staff Auth users, then add their profiles from the SQL editor:

```sql
insert into public.staff_profiles (user_id, display_name, role)
select id, 'Reception', 'receptionist'
from auth.users
where email = 'the-staff-email@example.com';
```

Use `manager` or `admin` only for staff who need those responsibilities. Keep the service-role key out of SQL shared with staff and out of the browser.

## Hosting environment

For the current Cloudflare Pages project, use these build settings:

- Production branch: `main`
- Build command: `exit 0`
- Build output directory: `public`
- Do not use `npx wrangler deploy` as a Pages deploy command. With Git integration, leave the deploy command empty and let Pages deploy the repository. For a manual upload, use `npx wrangler pages deploy public`.

The repository includes `wrangler.toml` with the Pages output directory and compatibility date. The `functions/` directory must remain at the repository root for Pages Functions routing.

Add the values in `.env.example` as server-side secrets in the Cloudflare Pages project:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `INTERNAL_API_SECRET`
- `RESEND_API_KEY`
- `RECEPTION_EMAIL`
- `RESEND_FROM_EMAIL`
- `PUBLIC_ASSET_BASE_URL` (optional public build variable; see asset storage above)

`INTERNAL_API_SECRET` should be generated as a long random value. The Resend sender domain must be verified before production email is enabled.

## API contract

### Public enquiry

`POST /api/inquiries`

```json
{
  "purpose": "stay",
  "checkIn": "2026-11-14",
  "checkOut": "2026-11-16",
  "guests": 2,
  "roomType": "Deluxe Double",
  "name": "Guest Name",
  "phone": "+91 90000 00000",
  "email": "guest@example.com",
  "message": "A quiet room if possible.",
  "consent": true
}
```

Send an `Idempotency-Key` header for retries. The response is `201` for a new enquiry and includes `inquiryId`, `reference`, and `status`. Repeating the same key safely returns the original record.

### Staff routes

Staff routes require `Authorization: Bearer <supabase-access-token>`:

- `GET /api/staff/inquiries?status=new&limit=25`
- `GET /api/staff/inquiries/:id`
- `PATCH /api/staff/inquiries/:id` with `status`, `assignedTo`, and/or `followUpAt`
- `POST /api/staff/inquiries/:id/notes` with `{ "body": "..." }`

The list endpoint returns a `nextBefore` cursor. Pass it back as `before` for stable keyset pagination.

### Reception notification drain

`POST /api/internal/notifications/drain` requires `Authorization: Bearer <INTERNAL_API_SECRET>`. Schedule it once per minute using the hosting scheduler already available to the deployment. It claims at most ten queued messages per request and retries failed delivery with bounded exponential backoff. Lease tokens prevent an expired worker from marking a newer delivery attempt as complete.

## Performance and safety decisions

- One database function creates the enquiry, reference, audit event, and notification row in one transaction.
- Public request bodies are capped at 16 KB; staff updates and notes are capped at 8 KB.
- Duplicate form submissions are handled with an indexed idempotency key.
- Staff lists use indexed status/date ordering and stable keyset pagination.
- Notification workers use `FOR UPDATE SKIP LOCKED`, bounded batches, leases, and retry limits.
- Database tables have RLS enabled; the server role is used only inside server functions.
- API responses expose request IDs while logs avoid guest message contents.

## Production acceptance check

Before launch, submit one real test enquiry, confirm its reference in Supabase, confirm the reception email, sign in as a staff user, update its status, add a note, and verify the event history. Then test a repeated request with the same `Idempotency-Key` and confirm no duplicate enquiry is created.
