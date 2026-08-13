# AI Lead Rescue

AI-powered lead response and appointment-request system for clinics.

## MVP

AI Lead Rescue helps clinics respond to website inquiries quickly, capture leads, handle appointment requests, and escalate conversations to staff when needed.

### Stack
- Lovable — frontend / staff dashboard
- Supabase — database, authentication, RLS
- n8n — automation workflows
- Claude API — AI response engine
- GitHub — source control

## MVP Scope

- Website chat widget
- Single clinic support
- Lead capture
- Appointment **requests** (staff confirmation required)
- Staff escalation
- Knowledge-base grounded responses
- Conversation and audit logging

## Safety Rules

The AI must not diagnose conditions or provide medical advice. Emergency situations are escalated immediately. Answers should be grounded in the clinic knowledge base; uncertain questions are escalated to staff.

## Staff Notifications

Notify staff only when:
1. A new appointment request is created.
2. The AI cannot answer confidently.
3. A patient explicitly asks for a human.

## Planned n8n Workflows

1. **W1 — Inbound Chat Handler**: receives website messages and creates/updates conversations.
2. **W2 — AI Response Engine**: retrieves approved knowledge and generates structured responses.
3. **W3 — Appointment Request Handler**: validates and records appointment requests.
4. **W4 — Staff Notification**: sends actionable staff alerts with debounce/idempotency protection.
5. **W5 — Abandoned Conversation Follow-Up**: follows up with conversations that stop before resolution.

## Core Data Model

- clinics
- conversations
- messages
- leads
- appointment_requests
- escalations
- staff_users
- knowledge_base
- audit_logs

## Repository Structure

```text
.
├── README.md
├── docs/
│   ├── architecture.md
│   ├── webhook-contract.md
│   ├── ai-guardrails.md
│   └── workflows.md
├── supabase/
│   └── migrations/
└── n8n/
    └── workflow-specs/
```

## Status

MVP foundation initialized. The next implementation phase is the Supabase schema/RLS, webhook contracts, AI structured-output contract, and n8n workflow specifications.
