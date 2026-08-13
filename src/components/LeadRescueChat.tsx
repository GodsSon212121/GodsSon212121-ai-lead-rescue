import { useState } from "react";
import {
  createEventId,
  sendLeadRescueMessage,
  type Patient,
} from "../lib/leadRescueClient";

type Props = {
  clinicId: string;
  sessionId?: string;
  patient?: Patient;
};

type ChatMessage = { role: "patient" | "assistant"; content: string };

export function LeadRescueChat({ clinicId, sessionId, patient }: Props) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const message = input.trim();
    if (!message || sending) return;

    setInput("");
    setError(null);
    setMessages((current) => [...current, { role: "patient", content: message }]);
    setSending(true);

    try {
      const result = await sendLeadRescueMessage({
        event_id: createEventId(),
        clinic_id: clinicId,
        conversation_id: conversationId,
        session_id: sessionId,
        message,
        patient,
      });

      if (result.conversation_id) setConversationId(result.conversation_id);
      if (result.message) {
        setMessages((current) => [
          ...current,
          { role: "assistant", content: result.message! },
        ]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  }

  return (
    <section aria-label="Clinic chat">
      <div aria-live="polite">
        {messages.map((message, index) => (
          <p key={`${message.role}-${index}`}>
            <strong>{message.role === "patient" ? "You" : "Clinic"}:</strong>{" "}
            {message.content}
          </p>
        ))}
      </div>

      {error && <p role="alert">{error}</p>}

      <form onSubmit={submit}>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="How can we help?"
          disabled={sending}
          aria-label="Message"
        />
        <button type="submit" disabled={sending || !input.trim()}>
          {sending ? "Sending…" : "Send"}
        </button>
      </form>
    </section>
  );
}
