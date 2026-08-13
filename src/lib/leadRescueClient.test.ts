import { describe, expect, it, vi, beforeEach } from "vitest";
import { createEventId, sendLeadRescueMessage } from "./leadRescueClient";

beforeEach(() => vi.restoreAllMocks());

describe("leadRescueClient", () => {
  it("creates an event id", () => {
    const id = createEventId();
    expect(id).toEqual(expect.any(String));
    expect(id.length).toBeGreaterThan(0);
  });

  it("posts a chat request to the Supabase function", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ conversation_id: "conv-1", message: "Hello" }),
    }));

    const result = await sendLeadRescueMessage({
      event_id: "evt-1",
      clinic_id: "clinic-1",
      message: "Hello",
    });

    expect(result.conversation_id).toBe("conv-1");
    expect(fetch).toHaveBeenCalledWith(
      "https://example.supabase.co/functions/v1/chat-webhook",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("surfaces backend errors", async () => {
    vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "automation_failed" }),
    }));

    await expect(
      sendLeadRescueMessage({
        event_id: "evt-2",
        clinic_id: "clinic-1",
        message: "Book me",
      }),
    ).rejects.toThrow("automation_failed");
  });
});
