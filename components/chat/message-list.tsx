"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/lib/types";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";

export function MessageList({
  messages,
  isThinking,
}: {
  messages: Message[];
  isThinking: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isThinking]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 md:px-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isThinking && messages[messages.length - 1]?.role !== "assistant" ? (
          <TypingIndicator />
        ) : null}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
