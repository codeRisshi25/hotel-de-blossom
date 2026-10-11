# Hotel De Blossom change requests

Tracked in the order requested on 11 October 2026.

- [x] **Banquet hall name:** rename the venue to Summit Hall throughout the site and venue metadata.
- [x] **Home dining preview:** remove dish prices from the home page and redesign the list so it still feels intentional and informative.
- [x] **Banquet hero title:** stop “Celebrate under warm gold light.” from clipping at the bottom.
- [x] **Footer wordmark:** show the full letters and let the colour hover animation cover each letter cleanly.
- [ ] **Deluxe Double rate:** the site fallback, API example and seed are ₹7,500, and a migration updates the existing database row. Apply the migration to production so the database-backed rate matches.
- [x] **WhatsApp guest templates:** add scenario-based editable messages with copy and open-in-WhatsApp actions to the De Blossom enquiry desk.

The web production build completed successfully. A Cloudflare Pages deploy does not apply Supabase migrations; item 5 remains pending until its SQL migration is applied to the production database.
