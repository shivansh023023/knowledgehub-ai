"use client";

import { useState } from "react";

import { api } from "@/lib/api";

import {
  ChatRequest,
  ChatResponse,
  Message,
} from "@/types/chat";

import { useChatStore } from "@/stores/chatStore";

export function useChat() {
  const { messages, addMessage, clearMessages } =
    useChatStore();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const sendMessage = async (
    question: string
  ) => {
    if (!question.trim()) return;

    try {
      setLoading(true);
      setError(null);

      // User message
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: question,
      };

      addMessage(userMessage);

      const body: ChatRequest = {
        question,
      };

      const response =
        await api.post<ChatResponse>(
          "/chat",
          body
        );

      // AI response
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.data.answer,
        sources: response.data.sources,
      };

      addMessage(assistantMessage);
    } catch (err: any) {
    console.error(err);

    console.log(err.response?.status);
    console.log(err.response?.data);

    setError("Failed to get response.");
} finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
}