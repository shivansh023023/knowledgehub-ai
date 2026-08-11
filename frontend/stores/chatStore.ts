import { create } from "zustand";

import { Message } from "@/types/chat";
import { Conversation } from "@/lib/conversations";

interface ChatStore {
  conversationId: string | null;
  messages: Message[];
  conversations: Conversation[];

  // Conversation ID
  setConversationId: (id: string | null) => void;

  // Messages
  setMessages: (messages: Message[]) => void;

  loadConversation: (
    id: string,
    messages: Message[]
  ) => void;

  // Conversations
  setConversations: (
    conversations: Conversation[]
  ) => void;

  addConversation: (
    conversation: Conversation
  ) => void;

  removeConversation: (
    id: string
  ) => void;

  updateConversation: (
    conversation: Conversation
  ) => void;

  // Chat messages
  addMessage: (message: Message) => void;

  updateMessage: (
    id: string,
    content: string
  ) => void;

  updateSources: (
    id: string,
    sources: Message["sources"]
  ) => void;

  // Clear
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>(
  (set) => ({
    conversationId: null,

    messages: [],

    conversations: [],

    // -------------------------
    // Conversation ID
    // -------------------------

    setConversationId: (id) =>
      set({
        conversationId: id,
      }),

    // -------------------------
    // Messages
    // -------------------------

    setMessages: (messages) =>
      set({
        messages,
      }),

    loadConversation: (
      id,
      messages
    ) =>
      set({
        conversationId: id,
        messages,
      }),

    // -------------------------
    // Conversations
    // -------------------------

    setConversations: (
      conversations
    ) =>
      set({
        conversations,
      }),

    addConversation: (
      conversation
    ) =>
      set((state) => {
        const exists =
          state.conversations.some(
            (item) =>
              item.id === conversation.id
          );

        if (exists) {
          return {
            conversations:
              state.conversations.map(
                (item) =>
                  item.id === conversation.id
                    ? conversation
                    : item
              ),
          };
        }

        return {
          conversations: [
            conversation,
            ...state.conversations,
          ],
        };
      }),

    removeConversation: (id) =>
      set((state) => ({
        conversations:
          state.conversations.filter(
            (conversation) =>
              conversation.id !== id
          ),
      })),

    updateConversation: (
      conversation
    ) =>
      set((state) => ({
        conversations:
          state.conversations.map(
            (item) =>
              item.id === conversation.id
                ? conversation
                : item
          ),
      })),

    // -------------------------
    // Chat messages
    // -------------------------

    addMessage: (message) =>
      set((state) => ({
        messages: [
          ...state.messages,
          message,
        ],
      })),

    updateMessage: (
      id,
      content
    ) =>
      set((state) => ({
        messages:
          state.messages.map(
            (message) =>
              message.id === id
                ? {
                    ...message,
                    content,
                  }
                : message
          ),
      })),

    updateSources: (
      id,
      sources
    ) =>
      set((state) => ({
        messages:
          state.messages.map(
            (message) =>
              message.id === id
                ? {
                    ...message,
                    sources,
                  }
                : message
          ),
      })),

    // -------------------------
    // Clear current chat
    // -------------------------

    clearMessages: () =>
      set({
        conversationId: null,
        messages: [],
      }),
  })
);