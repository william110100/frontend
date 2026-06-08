"use client";

import { Button, cn } from "@heroui/react";
import { IconTrash } from "@tabler/icons-react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Conversation } from "@/lib/types";
import { useDeleteConversation } from "@/lib/use-chat";
import { ROUTES } from "@/utils/constants";
import { ConfirmDialog } from "./confirm-dialog";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onNavigate?: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onNavigate,
}: ConversationItemProps) {
  const router = useRouter();
  const del = useDeleteConversation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleDelete() {
    del.mutate(conversation.id, {
      onSuccess: () => {
        setConfirmOpen(false);
        if (isActive) router.replace(ROUTES.chat);
      },
    });
  }

  return (
    <div
      className={cn(
        "group relative rounded-lg transition-colors",
        isActive ? "bg-surface-secondary" : "hover:bg-surface-hover",
      )}
    >
      <NextLink
        href={ROUTES.conversation(conversation.id)}
        onClick={onNavigate}
        title={conversation.title}
        className={cn(
          "block truncate rounded-lg px-3 py-2 pr-9 text-sm outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-focus",
          isActive
            ? "font-medium text-foreground"
            : "text-muted hover:text-foreground",
        )}
      >
        {conversation.title}
      </NextLink>

      <div
        className={cn(
          "absolute right-1 top-1/2 -translate-y-1/2 transition-opacity",
          "opacity-0 group-hover:opacity-100 focus-within:opacity-100 max-lg:opacity-100",
          isActive && "opacity-100",
        )}
      >
        <Button
          isIconOnly
          size="sm"
          variant="ghost"
          aria-label={`Delete “${conversation.title}”`}
          onPress={() => setConfirmOpen(true)}
          className="size-7 text-muted hover:text-danger"
        >
          <IconTrash className="size-4" />
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete chat?"
        description={`“${conversation.title}” will be permanently removed. This can’t be undone.`}
        confirmLabel="Delete"
        isPending={del.isPending}
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}
