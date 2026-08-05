"use client";

import { useState } from "react";

import {
  ChatRequest,
  Message,
} from "@/types/chat";

import { useChatStore } from "@/stores/chatStore";

export function useChat() {
  const {
    messages,
    addMessage,
    updateMessage,
    updateSources,
    clearMessages,
  } = useChatStore();

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

      // ---------------------
      // User message
      // ---------------------

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: question,
      };

      addMessage(userMessage);

      // ---------------------
      // Empty assistant message
      // ---------------------

      const assistantId =
        crypto.randomUUID();

      addMessage({
        id: assistantId,
        role: "assistant",
        content: "",
        sources: [],
      });

      const body: ChatRequest = {
        question,
      };

      const response =
        await fetch(
          "http://localhost:8000/api/chat/stream",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(body),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Failed to connect."
        );
      }

      if (!response.body) {
        throw new Error(
          "No response stream."
        );
      }

      const reader =
        response.body.getReader();

      const decoder =
        new TextDecoder();

      let buffer = "";
      let assistantText = "";

      while (true) {
        const {
          value,
          done,
        } = await reader.read();

        if (done) break;

        buffer += decoder.decode(
          value,
          {
            stream: true,
          }
        );

        while (true) {
          const newline =
            buffer.indexOf("\n");

          if (newline === -1)
            break;

          const line =
            buffer
              .slice(0, newline)
              .trim();

          buffer =
            buffer.slice(
              newline + 1
            );

          if (!line) continue;

          const event =
            JSON.parse(line);

          if (
            event.type === "token"
          ) {
            assistantText +=
              event.content;

            updateMessage(
              assistantId,
              assistantText
            );

            // Let React paint
            await new Promise<void>(
              (resolve) =>
                requestAnimationFrame(
                  () => resolve()
                )
            );
          }

          else if (
            event.type ===
            "sources"
          ) {
            updateSources(
              assistantId,
              event.sources
            );
          }

          else if (
            event.type ===
            "done"
          ) {
            break;
          }
        }
      }
    } catch (err) {
      console.error(err);

      setError(
        "Failed to get response."
      );
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