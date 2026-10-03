# Hotel De Blossom website

Hotel De Blossom’s website and fixed-scope enquiry backend. The backend foundation is implemented with Cloudflare Pages Functions and Supabase Postgres/Auth.

## Project development status — 2026-10-03

### Complete

- Supabase production schema, RLS hardening, indexes, audit trail, idempotent enquiry creation, and notification outbox.
- `hotel-assets` Supabase Storage bucket provisioned; current image assets are served from Cloudflare Pages.
- Cloudflare Pages project and Pages Functions deployment.
- Runtime secrets for Supabase, Resend testing, email routing, and internal notification authentication.
- OpenAPI contract, backend tests, typecheck, and architecture diagrams.

### Remaining product work

- Build the premium public Hotel De Blossom website and connect its enquiry forms.
- Build the protected staff dashboard UI on top of the existing staff API routes.
- Configure the once-per-minute notification drain scheduler.
- Complete production acceptance testing, then switch email delivery from `workrisshi@gmail.com` to `bookings@hoteldeblossom.com` and replace the Resend testing sender with a verified hotel-domain sender.

The repository currently does not contain the production homepage or staff dashboard UI. The deployed root will remain empty until those frontend surfaces are implemented.

## Verify locally

```sh
npm install
npm run typecheck
```

The prior plain HTML prototype is archived in `legacy/plain-html-prototype/` and is not the production frontend.

## Backend foundation

- Atomic public enquiry creation at `POST /api/inquiries`
- Reference numbers, idempotency, audit events, and notification outbox
- Authenticated staff enquiry list, detail, status, assignment, follow-up, notes, and history routes
- Protected reception email drain with leases and retries
- Supabase migration in [supabase/migrations/20261003000000_initial_enquiries.sql](supabase/migrations/20261003000000_initial_enquiries.sql)
- Local image fallback plus configurable Supabase Storage CDN URLs
- OpenAPI contract in [openapi.yaml](openapi.yaml)
- Cloudflare Pages configuration in [wrangler.toml](wrangler.toml)
- Setup and deployment instructions in [BACKEND_SETUP.md](BACKEND_SETUP.md)
- Technical topology and enquiry/email flow diagrams in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Before launch

- Run the migration in the production Supabase project.
- Add server-side secrets from `.env.example` to the hosting environment.
- Create the reception staff profile and configure the notification drain scheduler.
- Connect the production frontend enquiry forms to `POST /api/inquiries`.
- Point the existing domain to the hosting provider after the production acceptance check.
