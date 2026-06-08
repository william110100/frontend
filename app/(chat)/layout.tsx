"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/chat/sidebar";
import { SidebarProvider } from "@/components/chat/sidebar-context";
import { FullscreenLoader } from "@/components/ui/fullscreen-loader";
import { useSession } from "@/lib/use-auth";
import { ROUTES } from "@/utils/constants";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) router.replace(ROUTES.login);
  }, [isPending, session, router]);

  if (isPending || !session) return <FullscreenLoader />;

  return (
    <SidebarProvider>
      <div className="flex h-svh overflow-hidden bg-background">
        <Sidebar user={session.user} />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</main>
      </div>
    </SidebarProvider>
  );
}
