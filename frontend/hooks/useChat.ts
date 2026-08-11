"use client";

import { useState } from "react";

import {
  ChatRequest,
  Message,
} from "@/types/chat";

import { useChatStore } from "@/stores/chatStore";

export function useChat() {
  const {
    conversationId,
    messages,
    addMessage,
    updateMessage,
    updateSources,
    setConversationId,
    addConversation,
    clearMessages,
  } = useChatStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (question: string) => {
    if (!question.trim() || loading) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // -------------------------
      // Add user message
      // -------------------------

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: question,
      };

      addMessage(userMessage);

      // -------------------------
      // Add empty assistant message
      // -------------------------

      const assistantId = crypto.randomUUID();

      addMessage({
        id: assistantId,
        role: "assistant",
        content: "",
        sources: [],
      });

      // -------------------------
      // Request body
      // -------------------------

      const body: ChatRequest = {
        conversationId,
        question,
      };

      // -------------------------
      // Call backend
      // -------------------------

      const response = await fetch(
        "http://localhost:8000/api/chat/stream",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to connect to backend."
        );
      }

      if (!response.body) {
        throw new Error(
          "No response stream received."
        );
      }

      // -------------------------
      // Read stream
      // -------------------------

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";
      let assistantText = "";

      while (true) {
        const { value, done } =
          await reader.read();

        if (done) {
          break;
        }

        buffer += decoder.decode(value, {
          stream: true,
        });

        while (true) {
          const newline =
            buffer.indexOf("\n");

          if (newline === -1) {
            break;
          }

          const line = buffer
            .slice(0, newline)
            .trim();

          buffer = buffer.slice(
            newline + 1
          );

          if (!line) {
            continue;
          }

          let event;

          try {
            event = JSON.parse(line);
          } catch {
            continue;
          }

          // -------------------------
          // Conversation created
          // -------------------------

          if (
            event.type ===
            "conversation"
          ) {
            const newConversationId =
              event.conversationId;

            if (newConversationId) {
              // Set active conversation
              setConversationId(
                newConversationId
              );

              // IMPORTANT:
              // Add it directly to Zustand.
              // No GET request needed.
              addConversation({
                id: newConversationId,
                title: question.slice(0, 40),
                created_at:
                  new Date().toISOString(),
                updated_at:
                  new Date().toISOString(),
                last_message_at:
                  new Date().toISOString(),
              });
            }
          }

          // -------------------------
          // Streaming token
          // -------------------------

          else if (
            event.type === "token"
          ) {
            assistantText +=
              event.content ?? "";

            updateMessage(
              assistantId,
              assistantText
            );

            await new Promise<void>(
              (resolve) =>
                requestAnimationFrame(
                  () => resolve()
                )
            );
          }

          // -------------------------
          // Complete answer
          // -------------------------

          else if (
            event.type === "answer"
          ) {
            assistantText =
              event.content ?? "";

            updateMessage(
              assistantId,
              assistantText
            );
          }

          // -------------------------
          // Sources
          // -------------------------

          else if (
            event.type === "sources"
          ) {
            updateSources(
              assistantId,
              event.sources ?? []
            );
          }

          // -------------------------
          // Finished
          // -------------------------

          else if (
            event.type === "done"
          ) {
            break;
          }
        }
      }
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to get response."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    conversationId,
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
}