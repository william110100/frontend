export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export type MessageRole = "user" | "assistant";

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  preview?: string;
}

export interface AuthSession {
  token: string;
  user: User;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface SendMessageResult {
  conversation: Conversation;
  userMessage: Message;
  assistantMessage: Message;
}
