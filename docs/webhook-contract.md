# Webhook Contract

All n8n-facing webhook requests should use JSON and include a stable `event_id` for idempotency.

## Inbound chat

`POST /webhook/lead-rescue/chat`

```json
{
  "event_id": "evt_123",
  "clinic_id": "clinic_123",
  "conversation_id": "conv_123",
  "session_id": "session_123",
  "message": "I want to book an appointment",
  "patient": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+234..."
  },
  "timestamp": "2026-08-13T10:00:00Z"
}
```

## Expected response

```json
{
  "conversation_id": "conv_123",
  "message": "string",
  "needs_human": false,
  "appointment_request_created": false
}
```

## Rules

- Validate `clinic_id` and conversation ownership.
- Reject malformed payloads.
- Deduplicate using `event_id`.
- Never trust client-provided authorization claims for staff operations.
- Return stable error objects for workflow retries.
