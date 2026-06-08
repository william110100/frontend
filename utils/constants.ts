export const APP_NAME = "Yellow Chat";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  chat: "/chat",
  conversation: (id: string) => `/chat/${id}`,
} as const;
