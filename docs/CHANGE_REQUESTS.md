# Hotel De Blossom change requests

Tracked in the order requested on 11 October 2026.

- [x] **Banquet hall name:** rename the venue to Summit Hall throughout the site and venue metadata.
- [x] **Home dining preview:** remove dish prices from the home page and redesign the list so it still feels intentional and informative.
- [x] **Banquet hero title:** avoid line-mask clipping and give the display font enough line-box space.
- [x] **Footer wordmark:** give the large letters font-relative vertical room so the full outline and hover colour stay visible.
- [ ] **Deluxe Double rate:** the site fallback, API example and seed are ₹7,500, and a migration updates the existing database row. Apply the migration to production so the database-backed rate matches.
- [x] **WhatsApp guest templates:** add scenario-based editable messages with copy and open-in-WhatsApp actions to the De Blossom enquiry desk.
- [x] **Room rate refresh:** bypass browser and endpoint caching for public rates so staff price edits appear after a refresh.

The web production build completed successfully. A Cloudflare Pages deploy does not apply Supabase migrations; the Deluxe Double database value remains pending until its SQL migration is applied to production.
