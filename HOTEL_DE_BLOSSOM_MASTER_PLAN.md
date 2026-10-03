# Hotel De Blossom — Botanical Royal brand, booking, and deployment plan

## Summary

Build a mobile-first boutique hotel website for direct leisure guests. The experience will feel like a contemporary royal stay in Guwahati: intimate, floral, calm, and premium, with the original Hotel De Blossom gold floral emblem at the centre of the visual system.

The new site will retain the current hotel’s useful content pillars—rooms, restaurant, banquet and events, airport transfers, 24×7 reception, and direct booking—but will replace the generic template structure with an editorial, image-led, conversion-focused experience.

V1 includes:

- Brand-led marketing website
- Room, dining, and event enquiry flows
- WhatsApp and reception notifications
- Authenticated staff enquiry dashboard
- Static-first deployment with serverless APIs
- Fixed-scope delivery focused on guest enquiries and reception follow-up

The plain HTML prototype is **not** a visual, structural, or content reference for this project. The production implementation will move to Astro + TypeScript and take visual direction only from the live Hotel De Blossom website, the original logo, the original building hero photograph, and approved hotel photography.

## Brand and design system

### Core creative direction: Botanical Royal

The original logo’s gold flower and leaf illustration is the source of the design language. The flower should feel like a signature that appears at meaningful moments—never as busy wallpaper, clip art, or an unrelated generic floral pattern.

The desired impression is a refined urban residence with a softer, more botanical sense of luxury: warm marble, timber, brass, ivory, deep green, and a quiet evening mood for events and dining.

### Approved visual source material

- The original Hotel De Blossom gold floral logo and its proportions.
- The hotel-building photograph used in the hero of the current live website.
- Approved property, room, reception, food, and banquet photography from the hotel library.

Do not borrow layouts, components, copy, colour choices, or styling decisions from the prior plain HTML prototype.

### Colour tokens

| Role | Token | Value | Usage |
|---|---|---|---|
| Royal base | `--color-royal-forest` | `#163831` | Primary dark surfaces, event panels, footer |
| Deep base | `--color-heritage-night` | `#0D2823` | Hero overlays, dark booking states |
| Brand accent | `--color-antique-gold` | `#B8872E` | Buttons, rules, selected states, icon accents |
| Light surface | `--color-champagne` | `#F7F1E6` | Primary page background |
| Supporting neutral | `--color-sandstone` | `#D8C5A2` | Decorative fills and dividers |
| Evening accent | `--color-royal-plum` | `#3A1E2D` | Events, celebratory offers, evening dining |
| Primary text | `--color-charcoal` | `#171815` | Body text and high-contrast controls |
| Inverse text | `--color-ivory` | `#FFFDF8` | Dark-surface text |

Antique gold is an accent, not a body-text colour. All small text must meet WCAG AA contrast on its background.

### Typography

- **Display:** Cormorant Garamond, 500–600, for hero statements, page titles, room names, and editorial pull quotes.
- **Body/UI:** Manrope, 400–600, for descriptions, amenities, navigation, forms, and dashboard controls.
- **Metadata:** DM Mono, 400–500, for labels, dates, room codes, capacity, and booking details.

Typography rules:

- Display text is spacious, large, and calm; use italics only for one or two emphasized words in a headline.
- Mobile body text is never below 16px.
- Metadata uses uppercase mono labels with generous tracking, but never for long paragraphs.
- Use `font-display: swap` and reserve layout space for loaded fonts.

### Visual components

- Preserve the original logo’s proportions and clear space; do not redraw or recolour it.
- Use subtle SVG botanical line art derived from the logo’s petals and leaves at hero corners, section transitions, booking confirmation, and event pages.
- Frame selected images in grand arch masks; use this once per major page rather than on every card.
- Use antique-gold hairlines, embossed botanical patterns, and faint paper grain for depth.
- Style room cards like refined invitation cards: champagne surface, thin gold edge, large image, restrained practical details.
- Use deep forest or plum surfaces for high-emotion sections such as events, evening dining, and booking confirmation.
- Use inline SVG icons only. Do not use emoji, gold gradients, heavy ornate frames, falling-petal effects, glassmorphism, or generic luxury black-and-gold styling.

### Signature hero: building, wordmark, and depth

The homepage hero is the defining visual moment. It uses the **original live-site hotel-building photograph**, not a room or reception image.

Prepare three optimized visual layers from the approved high-resolution building photo:

1. **Background:** a wide, responsive building-and-sky photograph.
2. **Typography layer:** the oversized words `DE BLOSSOM` in Cormorant Garamond, set in antique gold or ivory at low contrast and marked `aria-hidden`.
3. **Foreground mask:** a transparent cutout of the hotel building/facade made from the same source image. It sits above the typography layer, so the building physically hides portions of the wordmark and makes the letters appear behind it.

The actual accessible H1 and booking CTA sit in a clear lower or side safe area above the composition. They must not depend on the decorative `DE BLOSSOM` lettering for meaning.

On scroll, apply a single restrained parallax treatment only within this hero:

- Background image: moves at `0.05×` scroll speed.
- Decorative `DE BLOSSOM` lettering: moves at `0.20×` scroll speed.
- Foreground building mask: remains nearly fixed at `0.02×` scroll speed.
- Limit all travel with `clamp()` so no layer moves more than 72px on desktop.
- Use only `transform: translate3d()` and opacity; never animate layout dimensions.
- On mobile, cap the movement at 24px and retain the building-over-letter composition.
- With `prefers-reduced-motion`, render the complete layered composition statically with no scroll-linked motion.

Preload the hero image, generate a mobile-specific crop that keeps the building recognizable, reserve the full hero height before loading, and avoid video or heavy canvas/WebGL effects.

### Motion and interaction

- Mobile-first baseline: 375px.
- Responsive checkpoints: 375, 768, 1024, and 1440px.
- Use an 8px spacing system with generous vertical rhythm.
- Every interactive target is 44–48px minimum.
- Use 150–400ms opacity and transform transitions only: gentle fades, image masks, and 8–16px upward reveals.
- Respect `prefers-reduced-motion`; non-essential movement becomes instant.
- Do not use autoplay video, horizontal swipe-only galleries, or animations that delay access to content. The layered building hero is the sole approved parallax treatment; no other section receives parallax.

## Public website structure

### Home

1. **Hero — A stay in bloom**
   The original hotel-building photograph becomes a layered, depth-led opening scene. Oversized decorative `DE BLOSSOM` lettering sits visually behind a transparent building cutout, while the accessible H1, original logo lockup, short brand statement, and booking CTA occupy a protected high-contrast safe area. The hero is the only scroll-parallax moment on the site.

2. **Reservation card**
   Date, guest, and preferred-room controls styled as an elegant booking card. On mobile, it opens as a bottom sheet. It must clearly state that reception confirms final availability and price.

3. **The Blossom Collection — Rooms**
   Editorial room preview with real photography and direct practical information: room type, bed, occupancy, size, and enquiry CTA.

4. **The Table — Dining**
   Restaurant imagery, cuisine direction, opening hours, price range, and a table/enquiry CTA.

5. **The Occasion — Banquet and events**
   A deep forest or plum story panel with gold botanical texture, capacity, suitable occasions, gallery, and event enquiry CTA.

6. **Thoughtfully yours — Stay details**
   Airport transfers, 24×7 front desk, location, parking, arrival help, and selected amenities.

7. **The hotel in bloom — Gallery and social proof**
   Categorized visual gallery, reviews/testimonials when available, Instagram link, and a map/location card.

8. **Arrival and contact**
   Address, directions, reception number, WhatsApp, FAQs, policies, and final reservation CTA.

Every public page must retain a sticky mobile **Reserve your stay** action in antique gold, plus a secondary WhatsApp action where appropriate.

### Rooms

Create a room overview plus a detail page for each approved room category. The Drive folders currently indicate Suite, Alt Double, Double, Twin, and Premium Double; reconcile these names with the hotel’s existing guest-facing names before publishing.

Each room page includes:

- Real image gallery with responsive variants
- Room type, bed configuration, occupancy, size, amenities, and inclusions
- Check-in/check-out information and policy links
- Simple editorial description rooted in actual room features
- Enquiry CTA and sticky mobile reservation action
- Related-room recommendations

### Dining

Include a food gallery, restaurant story, cuisine, opening hours, price range, breakfast information, and table/contact CTA. Present practical information in structured cards, not generic luxury copy.

### Events and banquet

Include space photography, maximum capacity, occasion types, layouts/packages when supplied, enquiry form, and direct reception contact. The design must read like an elegant invitation rather than a corporate venue brochure.

### Gallery and contact

Gallery categories: rooms, reception, dining, banquet, and property. Contact includes address, map, parking, airport transfer details, reception, WhatsApp, Instagram, and nearby landmarks.

### Staff dashboard

Protected enquiry list with filters, notes, assignment, follow-up dates, status changes, and enquiry history.

## Booking and enquiry flow

### Guest flow

1. Guest taps **Reserve your stay**, **Enquire**, or **Plan an occasion**.
2. A mobile bottom sheet or desktop booking card collects:

   - Purpose: stay, event, or group stay
   - Check-in and check-out dates
   - Guest count
   - Preferred room type
   - Name
   - Phone
   - Email
   - Notes
   - Consent checkbox

3. Client validates required fields and date order.
4. `POST /api/inquiries` creates the enquiry.
5. Guest sees a polished confirmation state with a reference number and optional WhatsApp follow-up action.
6. Reception receives an email notification and a WhatsApp follow-up link.
7. Staff manages the enquiry in the dashboard.

The enquiry flow must clearly state that reception will follow up to confirm the request.

### Enquiry API

```ts
type InquiryPurpose = "stay" | "event" | "group_stay";

type InquiryPayload = {
  purpose: InquiryPurpose;
  checkIn?: string;
  checkOut?: string;
  guests: number;
  roomType?: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  consent: boolean;
  honeypot?: string;
};

type InquiryResponse = {
  inquiryId: string;
  reference: string;
  status: "new";
};
```

Staff endpoints:

- `GET /api/staff/inquiries`
- `GET /api/staff/inquiries/:id`
- `PATCH /api/staff/inquiries/:id`
- `POST /api/staff/inquiries/:id/notes`

Statuses:

`new → contacted → provisional → confirmed → cancelled → closed`

### Database

Use Supabase Postgres and Auth. Core tables:

- `inquiries`
- `inquiry_notes`
- `inquiry_events`
- `staff_profiles`

The public form creates enquiries only through a server-side endpoint. Staff reads and updates require authenticated users with role-based authorization. Every status change creates an audit event.

## Technical and deployment architecture

### Frontend

Use:

- Astro
- TypeScript
- Astro content collections for rooms, dining, events, FAQs, gallery, and hotel details
- CSS variables for the Botanical Royal design tokens
- Minimal client JavaScript for forms, mobile navigation, booking bottom sheet, and dashboard interactions
- Optimized WebP/AVIF images with responsive `srcset`

### Backend

Use:

- Cloudflare Pages for hosting
- Cloudflare Pages Functions for `/api/*`
- Supabase Postgres for enquiry data
- Supabase Auth for staff login
- Email notification provider for reception
- WhatsApp deep links for guest follow-up

### Deployment

1. Create a GitHub-connected Cloudflare Pages project.
2. Configure the Astro build command and output directory.
3. Add preview deployments for pull requests.
4. Deploy `main` to production.
5. Connect the existing domain through DNS.
6. Configure HTTPS, `www` redirect, canonical URL, sitemap, and robots rules.
7. Add separate preview and production environment variables.
8. Configure the Supabase production project and database migrations.
9. Create the first reception/admin user.
10. Submit and process a real enquiry in production before launch.

Secrets must remain in environment variables and Supabase/Cloudflare secret storage. Hotel account passwords must never be committed or placed in frontend code.

## Content and launch checklist

Before implementation is launch-ready, collect:

- Final approved logo asset and brand usage rules
- Confirmed room names, occupancy, bed types, amenities, sizes, enquiry wording, and room photography
- Confirmed address, map pin, nearby landmarks, parking, and airport-transfer terms
- Dining cuisine, breakfast details, hours, price range, menu direction, and table-reservation policy
- Banquet capacity, packages, layouts, suitable occasions, and pricing approach
- Check-in, cancellation, privacy, and enquiry-consent policies
- Testimonials/review links and confirmed social links
- Confirmed reception notification address and staff dashboard users

## Testing and acceptance criteria

### Design and accessibility

- No horizontal scrolling at 375px.
- All public actions remain reachable in one tap from mobile navigation or sticky CTA.
- All controls are keyboard accessible with visible focus states.
- Inputs have associated labels and clear inline validation errors.
- Touch targets are at least 44px.
- Text and controls meet WCAG AA contrast requirements.
- Meaningful images have descriptive alt text.
- Reduced-motion mode disables non-essential animation.

### Booking flow

- Invalid dates are rejected.
- Check-out cannot precede check-in.
- Required fields show inline errors.
- Duplicate submits are prevented.
- Successful submission displays a reference number.
- Reception receives the notification.
- Unauthenticated users cannot access the dashboard.
- Staff status changes create an audit event.

### Performance

- Hero images are responsive and compressed.
- The hero building background and building-mask layers use the same approved source image, with responsive desktop and mobile crops.
- The hero image is preloaded; the foreground mask and decorative wordmark must not delay LCP.
- Below-fold images are lazy-loaded.
- Fonts use `font-display: swap`.
- Images and type reserve layout space to prevent cumulative layout shift.
- Target Lighthouse mobile scores: Performance 90+, Accessibility 95+, SEO 95+.

### Responsive QA

Test on:

- iPhone-width mobile viewport
- Android-width mobile viewport
- Tablet portrait
- Desktop 1440px
- Slow 4G network
- Keyboard-only navigation
- Reduced-motion preference
- Hero composition at 375px, 768px, and 1440px: the building must visibly occlude `DE BLOSSOM`, the accessible H1 must remain readable, and the text must never cover a booking control.
- Scroll-linked hero motion: smooth on supported devices, capped within the specified movement limits, and static when reduced motion is enabled.

## Assumptions and defaults

- Primary audience: direct leisure guests.
- Brand direction: Botanical Royal—contemporary, warm, floral, and restrained.
- Visual sources: the original live Hotel De Blossom website, original logo, original building hero photograph, and approved hotel image library only; the plain HTML prototype is excluded.
- Booking model: enquiry-based reception follow-up.
- Staff workflow: authenticated dashboard plus notifications.
- Frontend: Astro + TypeScript.
- Hosting: Cloudflare Pages.
- Backend data/auth: Supabase.
- Delivery ends after the enquiry is stored, reception is notified, and staff can manage the follow-up lifecycle.
- The existing domain will be connected after DNS access is available.
