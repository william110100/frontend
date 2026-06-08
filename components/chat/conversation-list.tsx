"use client";

import { useParams } from "next/navigation";
import { type DateBucket, dateBucket } from "@/lib/format";
import type { Conversation } from "@/lib/types";
import { useConversations } from "@/lib/use-chat";
import { ConversationItem } from "./conversation-item";

const BUCKET_ORDER: DateBucket[] = [
  "Today",
  "Yesterday",
  "Previous 7 days",
  "Older",
];

export function ConversationList({ onNavigate }: { onNavigate?: () => void }) {
  const { data: conversations, isPending } = useConversations();
  const params = useParams<{ id?: string }>();
  const activeId = typeof params?.id === "string" ? params.id : undefined;

  if (isPending) return <ListSkeleton />;

  if (!conversations || conversations.length === 0) {
    return (
      <p className="px-3 py-6 text-center text-sm text-muted">
        No conversations yet. Start a new chat to see it here.
      </p>
    );
  }

  const groups = new Map<DateBucket, Conversation[]>();
  for (const conversation of conversations) {
    const bucket = dateBucket(conversation.updatedAt);
    const list = groups.get(bucket) ?? [];
    list.push(conversation);
    groups.set(bucket, list);
  }

  return (
    <div className="flex flex-col gap-4">
      {BUCKET_ORDER.filter((bucket) => groups.has(bucket)).map((bucket) => (
        <div key={bucket} className="flex flex-col gap-0.5">
          <p className="px-3 pb-1 text-xs font-medium text-muted">{bucket}</p>
          {groups.get(bucket)?.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === activeId}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-1.5 px-1" aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-8 animate-pulse rounded-lg bg-surface-secondary"
          style={{ opacity: 1 - i * 0.12 }}
        />
      ))}
    </div>
  );
}
