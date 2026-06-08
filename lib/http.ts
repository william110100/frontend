import { API_BASE_URL } from "@/utils/constants";
import type { User } from "@/lib/types";

let accessToken: string | null = null;

export const getAccessToken = () => accessToken;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RefreshResult = { user: User; accessToken: string } | null;
let inflightRefresh: Promise<RefreshResult> | null = null;

export function refreshSession(): Promise<RefreshResult> {
  if (!inflightRefresh) {
    inflightRefresh = (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) {
          accessToken = null;
          return null;
        }
        const data = (await res.json()) as { user: User; accessToken: string };
        accessToken = data.accessToken;
        return data;
      } catch {
        accessToken = null;
        return null;
      } finally {
        inflightRefresh = null;
      }
    })();
  }
  return inflightRefresh;
}

interface ApiFetchInit extends RequestInit {
  _retried?: boolean;
}

export async function apiFetch<T>(
  path: string,
  init: ApiFetchInit = {},
): Promise<T> {
  const res = await rawFetch(path, init);

  if (res.status === 401 && !init._retried && !path.startsWith("/auth/")) {
    const refreshed = await refreshSession();
    if (refreshed) return apiFetch<T>(path, { ...init, _retried: true });
  }

  if (!res.ok) {
    if (res.status === 401) setAccessToken(null);
    throw new ApiError(res.status, await extractMessage(res));
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

function rawFetch(path: string, init: ApiFetchInit): Promise<Response> {
  const headers = new Headers(init.headers);
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });
}

async function extractMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { message?: string | string[] };
    const message = data?.message;
    if (Array.isArray(message)) return message.join(", ");
    return message ?? res.statusText;
  } catch {
    return res.statusText;
  }
}
