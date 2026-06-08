"use client";

import { BrandMark } from "@/components/ui/brand";
import { useStartConversation } from "@/lib/use-chat";
import { APP_NAME } from "@/utils/constants";
import { ChatHeader } from "./chat-header";
import { Composer } from "./composer";

const SUGGESTIONS = [
  "Draft a launch plan for a new feature",
  "Summarize this week’s team update",
  "Explain a tricky concept in simple terms",
  "Write a polite follow-up email",
];

export function NewChatScreen() {
  const start = useStartConversation();
  const send = (text: string) => start.mutate(text);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader title="New chat" showNewChat={false} />

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-8">
        <div className="w-full max-w-3xl">
          <div className="mb-8 flex flex-col items-center text-center">
            <BrandMark className="size-12 rounded-2xl" />
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              How can I help you today?
            </h2>
            <p className="mt-1.5 text-sm text-muted">
              Ask anything — or pick a starting point below.
            </p>
          </div>

          <Composer
            onSend={send}
            disabled={start.isPending}
            autoFocus
            placeholder={`Message ${APP_NAME}…`}
          />

          <div className="mt-2 grid grid-cols-1 gap-2 px-4 sm:grid-cols-2 md:px-6">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                disabled={start.isPending}
                onClick={() => send(suggestion)}
                className="rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
