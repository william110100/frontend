"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/use-auth";
import { ROUTES } from "@/utils/constants";

export function useRedirectIfAuthed() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && session) router.replace(ROUTES.chat);
  }, [session, isPending, router]);
}
