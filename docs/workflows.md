# n8n Workflow Specifications

## W1 — Inbound Chat Handler

Receive validated chat events, identify the clinic and conversation, persist the incoming message, then invoke W2.

**Controls:** idempotency, payload validation, tenant validation, structured errors.

## W2 — AI Response Engine

Load relevant approved knowledge, call Claude with the conversation context and guardrails, validate the structured output, persist the AI response, and return it to the chat layer.

**Escalate when:** emergency, human request, insufficient confidence, or missing knowledge.

## W3 — Appointment Request Handler

Capture the patient's requested appointment information and create an `appointment_requests` record with a pending status. This MVP does not perform live calendar booking.

## W4 — Staff Notification

Notify staff only for:

- new appointment request
- AI unable to answer / low confidence
- explicit human request
- emergency escalation

Use deduplication/debounce so one conversation does not generate notification spam.

## W5 — Abandoned Conversation Follow-Up

Identify conversations that stop before resolution. After a configurable delay, send a single appropriate follow-up unless the conversation is already resolved, escalated, or opted out.

## Workflow Design Requirements

Every workflow should be:

- retry-safe
- idempotent
- observable through audit logs
- explicit about success/failure states
- safe to run more than once
