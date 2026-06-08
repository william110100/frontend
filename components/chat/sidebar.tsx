"use client";

import { Button, cn } from "@heroui/react";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { BrandLockup } from "@/components/ui/brand";
import type { User } from "@/lib/types";
import { ROUTES } from "@/utils/constants";
import { ConversationList } from "./conversation-list";
import { useSidebar } from "./sidebar-context";
import { UserMenu } from "./user-menu";

function SidebarContent({
  user,
  onNavigate,
}: {
  user: User;
  onNavigate?: () => void;
}) {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex items-center justify-between gap-2 px-4 pb-2 pt-4">
        <BrandLockup />
        <Button
          isIconOnly
          size="sm"
          variant="ghost"
          aria-label="Close sidebar"
          className="lg:hidden"
          onPress={onNavigate}
        >
          <IconX className="size-5" />
        </Button>
      </div>

      <div className="px-3 pb-2 pt-1">
        <Button
          variant="secondary"
          fullWidth
          className="justify-start gap-2"
          onPress={() => {
            router.push(ROUTES.chat);
            onNavigate?.();
          }}
        >
          <IconPlus className="size-4.5" />
          New chat
        </Button>
      </div>

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-3 py-2">
        <ConversationList onNavigate={onNavigate} />
      </div>

      <div className="border-t border-border p-3">
        <UserMenu user={user} />
      </div>
    </div>
  );
}

export function Sidebar({ user }: { user: User }) {
  const { isOpen, close } = useSidebar();

  return (
    <>
      <aside className="hidden w-72 shrink-0 border-r border-border lg:block">
        <SidebarContent user={user} />
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          isOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close sidebar"
          onClick={close}
          className={cn(
            "absolute inset-0 cursor-default bg-black/40 transition-opacity duration-200",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 w-72 max-w-[82%] border-r border-border shadow-overlay transition-transform duration-200 ease-out",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <SidebarContent user={user} onNavigate={close} />
        </aside>
      </div>
    </>
  );
}
