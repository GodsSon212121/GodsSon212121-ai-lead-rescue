# End-to-End Acceptance Scenarios

These scenarios are the release gate for the MVP.

| Scenario | Expected result |
|---|---|
| Patient sends normal question | AI answers from clinic knowledge |
| Unknown clinic-policy question | AI avoids invention and escalates |
| Confidence below threshold | Staff notification created |
| Patient asks for human | Staff notification created |
| Emergency language | Immediate safe escalation; no diagnosis |
| Appointment request | `pending` appointment request created; never claims booking |
| Same `event_id` retried | No duplicate patient message |
| Staff views own clinic | Data visible through RLS |
| Staff attempts another clinic | Access denied |
| Abandoned conversation | One eligible follow-up only |
| Resolved conversation | No abandoned follow-up |

## Release gate

Do not call the system production-ready until every scenario passes against a deployed Supabase project and real n8n workflows.
