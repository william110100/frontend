import { API_BASE_URL } from "@/utils/constants";
import { getAccessToken, refreshSession } from "@/lib/http";
import type { Conversation, Message } from "@/lib/types";

export interface ChatStreamHandlers {
  onUser?: (message: Message) => void;
  onToken?: (value: string) => void;
  onDone?: (message: Message, conversation: Conversation) => void;
  onError?: (message: string) => void;
}

export async function streamMessage(
  conversationId: string,
  content: string,
  handlers: ChatStreamHandlers,
  retried = false,
): Promise<void> {
  const token = getAccessToken();
  const res = await fetch(
    `${API_BASE_URL}/conversations/${conversationId}/messages/stream`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ content }),
    },
  );

  if (res.status === 401 && !retried) {
    const refreshed = await refreshSession();
    if (refreshed)
      return streamMessage(conversationId, content, handlers, true);
  }

  if (!res.ok || !res.body) {
    handlers.onError?.("The assistant is unavailable. Please try again.");
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let boundary: number;
    while ((boundary = buffer.indexOf("\n\n")) >= 0) {
      const chunk = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);

      const dataLine = chunk
        .split("\n")
        .find((line) => line.startsWith("data:"));
      if (!dataLine) continue;

      const json = dataLine.slice(5).trim();
      if (!json) continue;

      let frame: { type: string; [k: string]: unknown };
      try {
        frame = JSON.parse(json);
      } catch {
        continue;
      }

      switch (frame.type) {
        case "user":
          handlers.onUser?.(frame.message as Message);
          break;
        case "token":
          handlers.onToken?.(frame.value as string);
          break;
        case "done":
          handlers.onDone?.(
            frame.message as Message,
            frame.conversation as Conversation,
          );
          break;
        case "error":
          handlers.onError?.(frame.message as string);
          break;
      }
    }
  }
}
