export type Patient = {
  name?: string;
  email?: string;
  phone?: string;
};

export type ChatRequest = {
  event_id: string;
  clinic_id: string;
  conversation_id?: string | null;
  session_id?: string | null;
  message: string;
  patient?: Patient;
};

export type ChatResponse = {
  conversation_id: string;
  message?: string;
  needs_human?: boolean;
  appointment_request_created?: boolean;
  duplicate?: boolean;
};

function endpoint(): string {
  const url = import.meta.env.VITE_SUPABASE_URL;
  if (!url) throw new Error("VITE_SUPABASE_URL is not configured");
  return `${url.replace(/\/$/, "")}/functions/v1/chat-webhook`;
}

export async function sendLeadRescueMessage(
  request: ChatRequest,
): Promise<ChatResponse> {
  const response = await fetch(endpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Chat request failed");
  }

  return payload as ChatResponse;
}

export function createEventId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}
