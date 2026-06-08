"use client";

import { useParams } from "next/navigation";
import { ConversationView } from "@/components/chat/conversation-view";

export default function ConversationPage() {
  const params = useParams<{ id: string }>();
  return <ConversationView id={params.id} />;
}
