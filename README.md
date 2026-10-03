# Hotel De Blossom website

Hotel De Blossom’s website and fixed-scope enquiry backend. The backend foundation is implemented with Cloudflare Pages Functions and Supabase Postgres/Auth.

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

## Before launch

- Run the migration in the production Supabase project.
- Add server-side secrets from `.env.example` to the hosting environment.
- Create the reception staff profile and configure the notification drain scheduler.
- Connect the production frontend enquiry forms to `POST /api/inquiries`.
- Point the existing domain to the hosting provider after the production acceptance check.
