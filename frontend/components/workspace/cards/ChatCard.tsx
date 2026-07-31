"use client";

import ChatInput from "./chat/ChatInput";
import ChatMessages from "./chat/ChatMessages";

import { useChat } from "@/hooks/useChat";

export default function ChatCard() {
  const {
    messages,
    loading,
    error,
    sendMessage,
  } = useChat();

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4">
        <p className="text-xs uppercase tracking-wider text-zinc-500">
          KnowledgeHub AI
        </p>

        <h2 className="mt-1 text-2xl font-semibold text-white">
          AI Assistant
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          Ask questions about your uploaded documents.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-900/50 bg-red-950/20 p-3">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6">
        <ChatMessages
          messages={messages}
          loading={loading}
        />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 pt-4">
        <ChatInput
          loading={loading}
          onSend={sendMessage}
        />
      </div>
    </div>
  );
}