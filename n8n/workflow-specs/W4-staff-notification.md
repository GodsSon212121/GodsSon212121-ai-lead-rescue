# W4 — Staff Notification

**Trigger:** appointment request, escalation, low-confidence answer, explicit human request, or emergency escalation.

## Flow

1. Receive event.
2. Validate clinic and event type.
3. Deduplicate against recent notifications for the same conversation/event.
4. Load eligible staff notification destination.
5. Build minimum necessary notification payload.
6. Send notification through the configured staff channel.
7. Record notification result in `audit_logs`.

## Notification payload

Include conversation reference, reason, lead contact information when appropriate, and the action staff should take. Do not include unnecessary sensitive conversation content.

## Debounce

Multiple AI messages in the same conversation should not create notification spam. A short configurable debounce window should be applied for non-emergency events. Emergency escalation should bypass normal debounce where appropriate.
