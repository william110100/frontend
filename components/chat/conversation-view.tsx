"use client";

import { Button, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { relativeTime } from "@/lib/format";
import { takePendingMessage } from "@/lib/pending";
import { useConversation, useMessages, useSendMessage } from "@/lib/use-chat";
import { ROUTES } from "@/utils/constants";
import { ChatHeader } from "./chat-header";
import { Composer } from "./composer";
import { MessageList } from "./message-list";

export function ConversationView({ id }: { id: string }) {
  const router = useRouter();
  const conversationQuery = useConversation(id);
  const messagesQuery = useMessages(id);
  const send = useSendMessage(id);
  const startedRef = useRef(false);

  useEffect(() => {
    startedRef.current = false;
  }, [id]);

  useEffect(() => {
    if (startedRef.current) return;
    const pending = takePendingMessage(id);
    if (pending) {
      startedRef.current = true;
      send.mutate(pending);
    }
  }, [id, send]);

  const conversation = conversationQuery.data;

  if (conversationQuery.isPending || messagesQuery.isPending) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <ChatHeader title="Chat" showNewChat={false} />
        <div className="flex flex-1 items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <ChatHeader title="Chat" showNewChat={false} />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <div>
            <p className="text-base font-semibold text-foreground">
              Conversation not found
            </p>
            <p className="mt-1 text-sm text-muted">It may have been deleted.</p>
          </div>
          <Button variant="secondary" onPress={() => router.push(ROUTES.chat)}>
            Start a new chat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ChatHeader
        title={conversation.title}
        subtitle={`Updated ${relativeTime(conversation.updatedAt)}`}
      />
      <MessageList
        messages={messagesQuery.data ?? []}
        isThinking={send.isPending}
      />
      <Composer
        onSend={(text) => send.mutate(text)}
        disabled={send.isPending}
        autoFocus
      />
    </div>
  );
}
