import { Message } from "@/types/chat";

const API_URL = "http://localhost:8000/api";

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  last_message_at: string;
}

export interface ConversationDetails extends Conversation {
  messages: Message[];
}

export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch(`${API_URL}/conversations`);

  if (!response.ok) {
    throw new Error("Failed to load conversations");
  }

  return response.json();
}

export async function getConversation(
  id: string
): Promise<ConversationDetails> {
  const response = await fetch(
    `${API_URL}/conversations/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to load conversation");
  }

  return response.json();
}

export async function deleteConversation(
  id: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/conversations/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete conversation");
  }
}