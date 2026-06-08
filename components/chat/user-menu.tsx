"use client";

import { Avatar, Dropdown } from "@heroui/react";
import { IconLogout, IconSelector } from "@tabler/icons-react";
import { initials } from "@/lib/format";
import type { User } from "@/lib/types";
import { useSignOut } from "@/lib/use-auth";

export function UserMenu({ user }: { user: User }) {
  const signOut = useSignOut();

  return (
    <Dropdown>
      <Dropdown.Trigger
        className="flex h-auto w-full cursor-pointer items-center justify-start gap-2.5 rounded-lg px-2 py-2 text-left outline-none transition-colors hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-focus"
        aria-label="Account menu"
      >
        <Avatar size="sm" className="shrink-0">
          <Avatar.Fallback>{initials(user.name)}</Avatar.Fallback>
        </Avatar>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-foreground">
            {user.name}
          </span>
          <span className="block truncate text-xs text-muted">
            {user.email}
          </span>
        </span>
        <IconSelector className="size-4 shrink-0 text-muted" />
      </Dropdown.Trigger>

      <Dropdown.Popover placement="top" className="min-w-56">
        <Dropdown.Menu>
          <Dropdown.Item
            textValue="Log out"
            onAction={() => signOut.mutate()}
            className="text-danger"
          >
            <span className="flex items-center gap-2">
              <IconLogout className="size-4" />
              Log out
            </span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
