export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMs = Date.now() - then;
  const min = Math.round(diffMs / 60_000);

  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;

  const hours = Math.round(min / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.round(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;

  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export type DateBucket = "Today" | "Yesterday" | "Previous 7 days" | "Older";

export function dateBucket(iso: string): DateBucket {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const t = new Date(iso).getTime();

  if (t >= startOfToday) return "Today";
  if (t >= startOfToday - 86_400_000) return "Yesterday";
  if (t >= startOfToday - 7 * 86_400_000) return "Previous 7 days";
  return "Older";
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  const result = parts.map((p) => p[0]?.toUpperCase() ?? "").join("");
  return result || "U";
}
