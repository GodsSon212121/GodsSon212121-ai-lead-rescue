# W1 — Inbound Chat Handler

**Trigger:** `POST /webhook/lead-rescue/chat`

## Nodes
1. Webhook — receive JSON.
2. Validate — require `event_id`, `clinic_id`, `conversation_id` or create one from session.
3. Idempotency — reject/return existing result when `event_id` was already processed.
4. Supabase — upsert lead and conversation.
5. Supabase — insert patient message.
6. Execute Workflow — invoke W2 AI Response Engine.
7. Respond — return structured response to frontend.

## Failure handling

Invalid requests return `400`. Duplicate events return the prior result. Upstream failures should be retryable without duplicating messages.
