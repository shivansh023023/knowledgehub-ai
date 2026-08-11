import { create } from "zustand";
import { Message } from "@/types/chat";

interface ChatStore {
  conversationId: string | null;
  messages: Message[];

  setConversationId: (id: string | null) => void;
  setMessages: (messages: Message[]) => void;
  loadConversation: (
    id: string,
    messages: Message[]
  ) => void;

  addMessage: (message: Message) => void;

  updateMessage: (
    id: string,
    content: string
  ) => void;

  updateSources: (
    id: string,
    sources: Message["sources"]
  ) => void;

  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  conversationId: null,
  messages: [],

  setConversationId: (id) =>
    set({
      conversationId: id,
    }),

  setMessages: (messages) =>
    set({
      messages,
    }),

  loadConversation: (id, messages) =>
    set({
      conversationId: id,
      messages,
    }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateMessage: (id, content) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id
          ? {
              ...message,
              content,
            }
          : message
      ),
    })),

  updateSources: (id, sources) =>
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id
          ? {
              ...message,
              sources,
            }
          : message
      ),
    })),

  clearMessages: () =>
    set({
      conversationId: null,
      messages: [],
    }),
}));