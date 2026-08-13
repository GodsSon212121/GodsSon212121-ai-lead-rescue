# Architecture

## System Flow

```text
Patient
  ↓
Lovable Website Chat
  ↓
n8n W1 Inbound Chat Handler
  ↓
Supabase (conversation + message)
  ↓
n8n W2 AI Response Engine
  ├── Supabase knowledge_base
  └── Claude API
  ↓
Patient response

Appointment request → W3 → Supabase → W4 → Staff
Escalation → W4 → Staff
Abandoned conversation → W5 → Follow-up
```

## Components

### Lovable
Provides the patient-facing chat widget and staff dashboard. It should never expose privileged service credentials.

### Supabase
Stores tenant/clinic data, conversations, messages, leads, appointment requests, escalations, staff users, approved knowledge, and audit events. Row Level Security is required for tenant isolation.

### n8n
Owns orchestration and integrations. Workflows should be idempotent and use stable event/message identifiers to prevent duplicate records and notifications.

### Claude
Generates structured responses using approved clinic knowledge. The model is constrained by the AI guardrails and should escalate when information is missing or confidence is insufficient.

## Security Principles

- Keep service-role and API secrets server-side.
- Enforce clinic-level RLS in Supabase.
- Validate webhook payloads.
- Use idempotency keys for externally retried events.
- Record sensitive workflow actions in audit_logs.
- Never place medical diagnosis/advice logic in the chatbot.
