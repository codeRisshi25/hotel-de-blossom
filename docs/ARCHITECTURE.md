# Hotel De Blossom — technical architecture

This is the fixed-scope production architecture for the hotel website and enquiry workflow. It deliberately excludes live availability, payments, and PMS integrations.

## Technical topology

```mermaid
flowchart LR
    guest[Guest browser]
    pages[Cloudflare Pages\nStatic frontend + CDN]
    functions[Cloudflare Pages Functions\nAPI and protected staff routes]
    inquiries[POST /api/inquiries]
    staff[Staff enquiry routes\n/authenticated]
    drain[Notification drain\n/internal/notifications/drain]
    db[(Supabase Postgres\nRLS + RPCs)]
    outbox[(Notification outbox\ntransactional queue)]
    storage[(Supabase Storage\nhotel-assets bucket)]
    resend[Resend Email API]
    reception[Reception mailbox\nTesting: workrisshi@gmail.com\nProduction: bookings@hoteldeblossom.com]
    staffuser[Reception / manager]

    guest --> pages
    pages --> functions
    functions --> inquiries
    functions --> staff
    functions --> drain
    inquiries -->|validate + idempotency| db
    db -->|creates| outbox
    staffuser -->|authenticated| staff
    staff --> db
    drain -->|claim with lease| outbox
    drain -->|transactional email| resend
    resend --> reception
    pages -.->|current production assets| pages
    pages -.->|optional future asset CDN| storage
```

### Responsibilities

| Layer | Responsibility |
| --- | --- |
| Cloudflare Pages | Serves the frontend and static assets from the edge. |
| Pages Functions | Handles validation, rate-sensitive API work, staff API routes, and the protected notification drain. |
| Supabase Postgres | Stores enquiries, notes, audit events, staff profiles, and the notification outbox. |
| Supabase RLS/RPCs | Keeps public creation narrow while staff and server operations remain controlled. |
| Supabase Storage | Provisioned `hotel-assets` bucket for future public hotel media; current deployed media remains in Pages assets. |
| Resend | Sends reception notifications. No customer email is sent in the initial scope. |

## Enquiry-to-email line diagram

```mermaid
sequenceDiagram
    autonumber
    participant G as Guest browser
    participant CF as Cloudflare Function
    participant DB as Supabase Postgres
    participant Q as Notification outbox
    participant S as Scheduler
    participant R as Resend
    participant M as Reception mailbox

    G->>CF: POST /api/inquiries
    CF->>CF: Validate fields, honeypot, body size, idempotency key
    CF->>DB: create_public_inquiry(payload, request_id)
    DB->>DB: Insert inquiry + audit event
    DB->>Q: Insert reception_new_inquiry
    DB-->>CF: Reference + status
    CF-->>G: 201 response with enquiry reference

    S->>CF: POST /api/internal/notifications/drain\nBearer internal secret
    CF->>Q: Claim up to 10 ready items with lease
    Q-->>CF: Leased notification batch
    CF->>R: Send from onboarding@resend.dev\nTo workrisshi@gmail.com (testing)
    R-->>M: New Hotel De Blossom enquiry <reference>
    CF->>Q: Mark sent

    alt Resend delivery fails
        CF->>Q: Mark failed + exponential retry time
    end
```

## Production switch after acceptance

Only the email routing changes:

```text
Testing:    onboarding@resend.dev  ->  workrisshi@gmail.com
Production: verified hotel sender  ->  bookings@hoteldeblossom.com
```

The database schema, API contract, outbox, retry logic, and deployment topology remain unchanged.

