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
    selectedDocumentId,
    messages,
    addMessage,
    updateMessage,
    updateSources,
    setConversationId,
    addConversation,
    touchConversation,
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

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: question,
      };

      addMessage(userMessage);

      const assistantId = crypto.randomUUID();

      addMessage({
        id: assistantId,
        role: "assistant",
        content: "",
        sources: [],
      });

      const body: ChatRequest = {
        conversationId,
        documentId: selectedDocumentId,
        question,
      };

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

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";
      let assistantText = "";
      let newConversationId: string | null = null;

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

          if (
            event.type === "conversation"
          ) {
            newConversationId =
              event.conversationId;

            if (newConversationId) {
              setConversationId(
                newConversationId
              );

              addConversation({
                id: newConversationId,
                title: question
                  .trim()
                  .slice(0, 50),
                created_at:
                  new Date().toISOString(),
                updated_at:
                  new Date().toISOString(),
                last_message_at:
                  new Date().toISOString(),
              });
            }
          }

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

          else if (
            event.type === "sources"
          ) {
            updateSources(
              assistantId,
              event.sources ?? []
            );
          }

          else if (
            event.type === "done"
          ) {
            break;
          }
        }
      }

      if (newConversationId) {
        touchConversation(
          newConversationId,
          question.trim().slice(0, 50)
        );
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
    selectedDocumentId,
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  };
}