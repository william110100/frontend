"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as api from "@/lib/api";
import { queryKeys } from "@/lib/keys";
import type { AuthSession, SignInPayload, SignUpPayload } from "@/lib/types";
import { ROUTES } from "@/utils/constants";

export function useSession() {
  return useQuery({
    queryKey: queryKeys.session,
    queryFn: api.getSession,
    staleTime: Infinity,
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: SignInPayload) => api.signIn(payload),
    onSuccess: (session: AuthSession) => {
      queryClient.setQueryData(queryKeys.session, session);
      router.push(ROUTES.chat);
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (payload: SignUpPayload) => api.signUp(payload),
    onSuccess: (session: AuthSession) => {
      queryClient.setQueryData(queryKeys.session, session);
      router.push(ROUTES.chat);
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: api.signOut,
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData(queryKeys.session, null);
      router.replace(ROUTES.login);
    },
  });
}
