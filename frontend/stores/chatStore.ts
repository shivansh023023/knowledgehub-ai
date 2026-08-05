import { create } from "zustand";

import { Message } from "@/types/chat";

interface ChatStore {
  messages: Message[];

  addMessage: (
    message: Message
  ) => void;

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

export const useChatStore =
  create<ChatStore>((set) => ({
    messages: [],

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
        messages: state.messages.map(
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
        messages: state.messages.map(
          (message) =>
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
        messages: [],
      }),
  }));