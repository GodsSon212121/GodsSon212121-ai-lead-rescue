# W5 — Abandoned Conversation Follow-Up

**Trigger:** scheduled workflow.

## Flow

1. Query conversations that are open, inactive beyond the configured threshold, and not already followed up.
2. Exclude resolved, escalated, opted-out, or recently contacted conversations.
3. Send one concise follow-up.
4. Persist follow-up event.
5. Mark the conversation metadata so it is not repeatedly contacted.

## Safety

Follow-up must never imply that an appointment was booked or that staff confirmed availability. Respect clinic communication rules and patient opt-out state.
