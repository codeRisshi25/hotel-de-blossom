# Hotel De Blossom

Website, booking-request flow and front-desk dashboard for Hotel De Blossom, Guwahati.

## Run everything with one command

```sh
npm install
cp .env.example .env   # add the Supabase values (see BACKEND_SETUP.md)
npm run dev
```

| URL | What |
|---|---|
| http://localhost:5173 | Public website (React + Vite, hot reload) |
| http://localhost:5173/staff | Front-desk dashboard (Supabase staff login) |
| http://127.0.0.1:8788/api/* | Cloudflare Pages Functions, proxied from the site at `/api` |

`npm run dev` starts the API (`wrangler pages dev`) and the web app together. The API reads secrets from the repo-root `.env`; without it, the site still runs and the booking form shows a friendly "could not save" message.

To point the local site at a deployed backend instead of the local API: `API_ORIGIN=https://<your-pages-domain> npm run dev -w @hdb/web`.

## Monorepo layout

```
apps/
  web/        React 19 + Vite + Tailwind v4 + GSAP (ScrollTrigger, SplitText) + Lenis
              public site, booking drawer, and the /staff dashboard
  api/        Cloudflare Pages Functions (functions/), Supabase REST helpers, tests, OpenAPI
packages/
  shared/     inquiry types, validation (used by both the API and the booking form), asset paths
supabase/     database migrations
```

| Command | Does |
|---|---|
| `npm run dev` | API + website together |
| `npm run build` | Production build of the website into `apps/web/dist` |
| `npm run preview` | Build, then serve the built site and the Functions together on :8788 |
| `npm test` | API tests |
| `npm run typecheck` | Type-check every workspace |
| `npm run deploy` | Build and `wrangler pages deploy` (Functions from `apps/api`, assets from `apps/web/dist`) |

## Bookings are requests, not confirmations

Every "Reserve" / "Request this room" / "Plan an occasion" action opens the same booking form. It posts to `POST /api/inquiries`, which stores the request with status **`new`** and queues the reception email. The guest sees a reference number (`HDB-YYYY-NNNNNN`) and is told clearly that **the front desk will contact them to confirm** — nothing is booked or charged. Reception moves it through `new → contacted → provisional → confirmed` in the dashboard.

Room "from" prices come from `GET /api/rates` (the `room_rates` table staff edit in the dashboard) and fall back to the live-site prices when no rate is set. Rate `room_type` values should be `Deluxe Double`, `Deluxe Twin` and `Executive Suite`.

## Website routes

`/` · `/rooms` · `/rooms/deluxe-double` · `/rooms/deluxe-twin` · `/rooms/executive-suite` · `/dining` (with the full menu) · `/events` · `/gallery` · `/about` · `/contact` · `/book` · `/staff`

Old WordPress URLs (`/our-rooms/`, `/accommodation/*`, `/restaurant/`, `/meetings-and-events/`) redirect to the new routes.

## Content

- Site copy, rooms, FAQs and gallery: `apps/web/src/content/site.ts`
- Restaurant menu (transcribed from the in-house PDF): `apps/web/src/content/menu.ts`; the PDF itself is downloadable at `/menu/hotel-de-blossom-menu.pdf`
- Images: `apps/web/public/images/<area>/<name>.webp` with a `-sm.webp` variant for phones

Deployment, secrets and the database are covered in [BACKEND_SETUP.md](BACKEND_SETUP.md); diagrams are in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
