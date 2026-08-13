# Frontend Contract

The Lovable client should treat the backend as an API boundary and never contain privileged credentials.

## Chat request

```json
{
  "event_id": "client-generated-id",
  "clinic_id": "clinic-id",
  "conversation_id": "conversation-id-or-null",
  "session_id": "session-id",
  "message": "patient message",
  "patient": {
    "name": "optional",
    "email": "optional",
    "phone": "optional"
  }
}
```

## Chat response

```json
{
  "conversation_id": "conversation-id",
  "message": "assistant message",
  "needs_human": false,
  "appointment_request_created": false
}
```

## Staff dashboard surfaces

- Overview / response-time metrics
- Conversations
- Leads
- Appointment requests
- Escalations
- Knowledge base
- Settings
- Audit activity

Staff-only views must rely on Supabase Auth + RLS rather than frontend-only route protection.
