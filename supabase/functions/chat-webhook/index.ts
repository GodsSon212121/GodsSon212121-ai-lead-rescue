import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ChatRequest = {
  event_id: string;
  clinic_id: string;
  conversation_id?: string | null;
  session_id?: string | null;
  message: string;
  patient?: { name?: string; email?: string; phone?: string };
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  try {
    const body = (await req.json()) as Partial<ChatRequest>;
    if (!body.event_id || !body.clinic_id || !body.message?.trim()) {
      return json({ error: "invalid_request", message: "event_id, clinic_id and message are required" }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const n8nUrl = Deno.env.get("N8N_CHAT_WEBHOOK_URL");
    if (!supabaseUrl || !serviceKey || !n8nUrl) {
      return json({ error: "server_not_configured" }, 500);
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const { data: duplicate } = await supabase
      .from("messages")
      .select("id, conversation_id")
      .eq("event_id", body.event_id)
      .maybeSingle();

    if (duplicate) {
      return json({
        conversation_id: duplicate.conversation_id,
        duplicate: true,
      });
    }

    const response = await fetch(n8nUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Event-ID": body.event_id },
      body: JSON.stringify(body),
    });

    const payload = await response.json().catch(() => ({ error: "invalid_n8n_response" }));
    if (!response.ok) return json({ error: "automation_failed", details: payload }, 502);

    return json(payload, 200);
  } catch (error) {
    console.error(error);
    return json({ error: "internal_error" }, 500);
  }
});
