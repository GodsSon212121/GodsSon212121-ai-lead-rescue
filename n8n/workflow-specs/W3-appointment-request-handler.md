# W3 — Appointment Request Handler

**Trigger:** appointment intent from W2 or explicit appointment request event.

## Flow

1. Validate clinic and conversation.
2. Resolve/create lead.
3. Validate requested date/time as user-provided preference, not confirmed availability.
4. Create `appointment_requests` with `status = pending`.
5. Write audit log.
6. Invoke W4 staff notification.
7. Return a patient-safe confirmation that the request was received and requires staff confirmation.

## Important

This MVP does **not** claim a live appointment has been booked. It creates a request for staff to confirm.
