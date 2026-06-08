"use client";

import { Button } from "@heroui/react";
import { IconMenu2, IconMessagePlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";
import { useSidebar } from "./sidebar-context";

interface ChatHeaderProps {
  title: string;
  subtitle?: string;
  showNewChat?: boolean;
}

export function ChatHeader({
  title,
  subtitle,
  showNewChat = true,
}: ChatHeaderProps) {
  const { open } = useSidebar();
  const router = useRouter();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-surface/85 px-3 backdrop-blur md:px-5">
      <Button
        isIconOnly
        size="sm"
        variant="ghost"
        aria-label="Open sidebar"
        className="lg:hidden"
        onPress={open}
      >
        <IconMenu2 className="size-5" />
      </Button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold text-foreground">
          {title}
        </h1>
        {subtitle ? (
          <p className="truncate text-xs text-muted">{subtitle}</p>
        ) : null}
      </div>

      {showNewChat ? (
        <Button
          isIconOnly
          size="sm"
          variant="ghost"
          aria-label="New chat"
          onPress={() => router.push(ROUTES.chat)}
        >
          <IconMessagePlus className="size-5" />
        </Button>
      ) : null}
    </header>
  );
}
