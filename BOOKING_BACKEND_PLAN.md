# Hotel De Blossom enquiry backend plan

The delivery scope is a complete enquiry workflow for Hotel De Blossom: guest request, database record, reception notification, and staff follow-up dashboard.

The backend foundation for this scope is implemented in `functions/`, `src/server/`, and `supabase/migrations/20261003000000_initial_enquiries.sql`. Deployment setup is documented in [BACKEND_SETUP.md](BACKEND_SETUP.md).

## Delivery scope

- Add a small API (`POST /api/inquiries`) that validates and stores stay/event requests.
- Generate a reference number and show a confirmation state to the guest.
- Notify reception by email and provide a WhatsApp follow-up link.
- Add a lightweight authenticated dashboard for enquiry status: new, contacted, provisional, confirmed, cancelled, closed.
- Add notes, follow-up dates, assignment, and an audit history for status changes.
- Keep phone numbers, email credentials, and notification tokens in the deployment environment, never in the browser bundle or repository.

## Fixed data model

- `inquiries`: guest details, purpose, dates, guest count, preferred room, message, consent, status, assignee, timestamps.
- `inquiry_notes`: internal staff notes linked to an enquiry.
- `inquiry_events`: status changes and audit history.
- `staff_profiles`: authenticated staff identity, role, and active state.
- `notification_outbox`: durable reception notification queue with leases and retry state.

## Required enquiry statuses

`new → contacted → provisional → confirmed → cancelled → closed`

## Security and acceptance

- Public guests can create enquiries but cannot read other records.
- Staff dashboard access requires authentication and role checks.
- All staff status changes create an audit event.
- Duplicate submissions are prevented or safely identified.
- Sensitive credentials remain in environment variables.
- Successful enquiries return a reference number and notify reception.

## Delivery boundary

This project ends after the enquiry is stored, reception is notified, and staff can manage the follow-up lifecycle in the dashboard.
