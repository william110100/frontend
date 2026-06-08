let pending: { conversationId: string; content: string } | null = null;

export function setPendingMessage(
  conversationId: string,
  content: string,
): void {
  pending = { conversationId, content };
}

export function takePendingMessage(conversationId: string): string | null {
  if (pending && pending.conversationId === conversationId) {
    const { content } = pending;
    pending = null;
    return content;
  }
  return null;
}
