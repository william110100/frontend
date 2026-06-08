"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FullscreenLoader } from "@/components/ui/fullscreen-loader";
import { useSession } from "@/lib/use-auth";
import { ROUTES } from "@/utils/constants";

export default function HomePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;
    router.replace(session ? ROUTES.chat : ROUTES.login);
  }, [isPending, session, router]);

  return <FullscreenLoader />;
}
