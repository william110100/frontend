"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as api from "@/lib/api";
import { streamMessage } from "@/lib/sse";
import { queryKeys } from "@/lib/keys";
import { setPendingMessage } from "@/lib/pending";
import type { Conversation, Message } from "@/lib/types";
import { ROUTES } from "@/utils/constants";

const TEMP_USER = "temp-user";
const STREAMING_ASSISTANT = "streaming-assistant";

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.conversations,
    queryFn: api.listConversations,
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: queryKeys.conversation(id),
    queryFn: () => api.getConversation(id),
    enabled: Boolean(id),
  });
}

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: queryKeys.messages(conversationId),
    queryFn: () => api.listMessages(conversationId),
    enabled: Boolean(conversationId),
  });
}

export function useStartConversation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (content: string) => api.createConversation(),
    onSuccess: (conversation: Conversation, content: string) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
      setPendingMessage(conversation.id, content);
      router.push(ROUTES.conversation(conversation.id));
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteConversation(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.messages(id) });
      queryClient.removeQueries({ queryKey: queryKeys.conversation(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
  });
}

export function useRenameConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      api.renameConversation(id, title),
    onSuccess: (conversation: Conversation) => {
      queryClient.setQueryData(
        queryKeys.conversation(conversation.id),
        conversation,
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  const key = queryKeys.messages(conversationId);

  const patchMessages = (updater: (list: Message[]) => Message[]) =>
    queryClient.setQueryData<Message[]>(key, (old) => updater(old ?? []));

  return useMutation<void, Error, string, { previous: Message[] }>({
    onMutate: async (content: string) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Message[]>(key) ?? [];
      const optimisticUser: Message = {
        id: TEMP_USER,
        conversationId,
        role: "user",
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData<Message[]>(key, [...previous, optimisticUser]);
      return { previous };
    },
    mutationFn: async (content: string) => {
      let assistantText = "";
      let streamError: string | null = null;

      await streamMessage(conversationId, content.trim(), {
        onUser: (real) =>
          patchMessages((list) =>
            list.map((m) => (m.id === TEMP_USER ? real : m)),
          ),
        onToken: (value) => {
          assistantText += value;
          patchMessages((list) => {
            if (list.some((m) => m.id === STREAMING_ASSISTANT)) {
              return list.map((m) =>
                m.id === STREAMING_ASSISTANT
                  ? { ...m, content: assistantText }
                  : m,
              );
            }
            return [
              ...list,
              {
                id: STREAMING_ASSISTANT,
                conversationId,
                role: "assistant",
                content: assistantText,
                createdAt: new Date().toISOString(),
              },
            ];
          });
        },
        onDone: (message, conversation) => {
          patchMessages((list) =>
            list.map((m) => (m.id === STREAMING_ASSISTANT ? message : m)),
          );
          queryClient.setQueryData(
            queryKeys.conversation(conversationId),
            conversation,
          );
          queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
        },
        onError: (msg) => {
          streamError = msg;
          queryClient.invalidateQueries({ queryKey: key });
          queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
        },
      });

      if (streamError) throw new Error(streamError);
    },
    onError: (_error, _content, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: key });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
    },
  });
}
