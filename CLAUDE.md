# CLAUDE.md

Hotel De Blossom (Guwahati): public website, booking-request flow, front-desk dashboard. Bookings are *requests*, not confirmations. No availability, payments or PMS.

## Layout (npm workspaces)

- `apps/web` — React 19 + Vite 8 + Tailwind v4 + GSAP/Lenis. Public site and `/staff` dashboard (`src/staff/`). Site copy in `src/content/site.ts`, menu in `src/content/menu.ts`.
- `apps/api` — Cloudflare Pages Functions (`functions/`, file-based routes under `functions/api/`). Shared server helpers in `src/server/` (`supabase-rest.ts` talks to Supabase REST/RPC with the service-role key). `openapi.yaml` is the contract.
- `packages/shared` — inquiry types, `validateInquiry` (used by API and booking form), asset URL resolver.
- `supabase/migrations` — 4 migrations (enquiries + outbox, security hardening, storage bucket, staff dashboard: `room_rates`, archive).
- `scripts/create-staff.ts` — creates a staff Auth user + profile.
- `legacy/` — old plain-HTML prototype. Ignore.

## Commands

- `npm run dev` — API (`wrangler pages dev`, :8788) + web (:5173, proxies `/api`). Copies root `.env` to `apps/api/.dev.vars`.
- `npm run typecheck`, `npm test` (API tests, `tsx --test`), `npm run build`, `npm run deploy` (build + `wrangler pages deploy`).
- `npm run build` = client build, SSR build, then `apps/web/scripts/prerender.mjs`: one static HTML file per public route (real content, meta, canonical, JSON-LD), plus `sitemap.xml`, `robots.txt`, `404.html` and noindex staff shells. Page meta lives in `apps/web/src/seo.ts`; set `PUBLIC_SITE_URL` for the canonical origin.
- `npm run images -w @hdb/web` after adding or replacing images: writes AVIF twins, `src/content/image-sizes.json` and the social card.
- Run one test file: `npm test -w @hdb/api -- tests/backend.test.ts`.

## Data flow

Guest form -> `POST /api/inquiries` (validate, honeypot, 16 KB cap, idempotency key) -> Postgres RPC creates inquiry + audit event + `notification_outbox` row -> `POST /api/internal/notifications/drain` (Bearer `INTERNAL_API_SECRET`, needs a scheduler) claims rows with leases and sends via Resend. Staff routes (`/api/staff/*`) require a Supabase access token and an active `staff_profiles` row (`requireStaff`). Status flow: `new -> contacted -> provisional -> confirmed` (plus closed/cancelled; only those can be archived).

## Conventions

- All DB access goes through server functions. Never expose the service-role key to the browser; web reads only `PUBLIC_*` vars.
- RLS on every table; mutations use `security definer` RPCs granted to `service_role` only.
- Room types must match `Deluxe Double`, `Deluxe Twin`, `Executive Suite`.
- Docs: `README.md`, `BACKEND_SETUP.md` (deploy, secrets, API), `docs/ARCHITECTURE.md` (diagrams).
