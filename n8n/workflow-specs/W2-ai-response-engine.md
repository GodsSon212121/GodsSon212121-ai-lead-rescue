# W2 — AI Response Engine

**Input:** conversation ID, clinic ID, current patient message.

## Nodes
1. Receive workflow input.
2. Supabase — load recent conversation messages.
3. Supabase — load active clinic knowledge.
4. Code/Transform — build constrained model context.
5. Claude API — generate structured JSON response.
6. Validate JSON — reject malformed output.
7. Decision — escalate if `needs_human`, emergency/human intent, or confidence below configured threshold.
8. Supabase — persist AI message and audit event.
9. Execute Workflow — invoke W4 if escalation is required.
10. Return response.

## Model contract

```json
{
  "message": "string",
  "confidence": 0.0,
  "needs_human": false,
  "reason": null,
  "intent": "general"
}
```

The workflow must not trust free-form model output. Validate types, allowed intent values, confidence range, and required fields before sending anything to the patient.
