# Deployment Checklist

## Supabase

1. Create a Supabase project.
2. Apply `supabase/migrations/0001_initial_schema.sql`.
3. Deploy `supabase/functions/chat-webhook`.
4. Set function secrets:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `N8N_CHAT_WEBHOOK_URL`
5. Verify RLS with a staff user from a clinic and confirm cross-clinic reads/writes are denied.

## n8n

Create the five workflows described in `n8n/workflow-specs/`.

Store the Anthropic API key only in n8n credentials/secrets. Do not place it in Lovable or browser code.

## Lovable

Configure the frontend to call the Supabase Edge Function endpoint. Use only public Supabase client configuration in the browser. Never ship a service-role key.

## Production checks

- Test duplicate `event_id` handling.
- Test low-confidence escalation.
- Test explicit human request.
- Test emergency escalation.
- Test appointment request creation without falsely confirming a booking.
- Test staff RLS isolation.
- Test abandoned conversation follow-up exclusions.
- Confirm secrets are absent from Git history and frontend bundles.
