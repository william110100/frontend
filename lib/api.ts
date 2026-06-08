import { apiFetch, ApiError, refreshSession, setAccessToken } from "@/lib/http";
import type {
  AuthSession,
  Conversation,
  Message,
  SendMessageResult,
  SignInPayload,
  SignUpPayload,
  User,
} from "@/lib/types";

interface AuthResponse {
  user: User;
  accessToken: string;
}

export async function getSession(): Promise<AuthSession | null> {
  const refreshed = await refreshSession();
  if (!refreshed) return null;
  try {
    const { user } = await apiFetch<{ user: User }>("/auth/me");
    return { token: refreshed.accessToken, user };
  } catch {
    return { token: refreshed.accessToken, user: refreshed.user };
  }
}

export async function signUp(payload: SignUpPayload): Promise<AuthSession> {
  const data = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    }),
  });
  setAccessToken(data.accessToken);
  return { token: data.accessToken, user: data.user };
}

export async function signIn(payload: SignInPayload): Promise<AuthSession> {
  const data = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    }),
  });
  setAccessToken(data.accessToken);
  return { token: data.accessToken, user: data.user };
}

export async function signOut(): Promise<void> {
  try {
    await apiFetch<void>("/auth/logout", { method: "POST" });
  } finally {
    setAccessToken(null);
  }
}

export function listConversations(): Promise<Conversation[]> {
  return apiFetch<Conversation[]>("/conversations");
}

export async function getConversation(
  id: string,
): Promise<Conversation | null> {
  try {
    return await apiFetch<Conversation>(`/conversations/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function createConversation(title = "New chat"): Promise<Conversation> {
  return apiFetch<Conversation>("/conversations", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export function renameConversation(
  id: string,
  title: string,
): Promise<Conversation> {
  return apiFetch<Conversation>(`/conversations/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ title }),
  });
}

export function deleteConversation(id: string): Promise<void> {
  return apiFetch<void>(`/conversations/${id}`, { method: "DELETE" });
}

export function listMessages(conversationId: string): Promise<Message[]> {
  return apiFetch<Message[]>(`/conversations/${conversationId}/messages`);
}

export function sendMessage(
  conversationId: string,
  content: string,
): Promise<SendMessageResult> {
  return apiFetch<SendMessageResult>(
    `/conversations/${conversationId}/messages`,
    { method: "POST", body: JSON.stringify({ content }) },
  );
}
