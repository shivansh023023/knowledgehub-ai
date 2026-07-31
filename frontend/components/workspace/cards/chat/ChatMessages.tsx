"use client";

import { useEffect, useRef } from "react";

import { Message } from "@/types/chat";

import ChatMessage from "./ChatMessage";

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
}

export default function ChatMessages({
  messages,
  loading,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800">
            🤖
          </div>

          <h3 className="text-xl font-semibold text-white">
            KnowledgeHub AI
          </h3>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Ask questions about your uploaded documents and get
            context-aware answers powered by RAG.
          </p>

          <div className="mt-8 space-y-2 text-sm text-zinc-500">
            <p>💡 Summarize this PDF</p>
            <p>💡 Explain Layer Normalization</p>
            <p>💡 Compare Xavier vs He Initialization</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
        />
      ))}

      {loading && (
        <div className="flex items-center gap-3 pl-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300">
            AI
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400" />
            </div>

            <span className="text-sm text-zinc-400">
              Thinking...
            </span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}