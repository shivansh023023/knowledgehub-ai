"use client";

import { Message } from "@/types/chat";
import MarkdownMessage from "@/components/workspace/cards/chat/MarkdownMessage";
import ChatSources from "@/components/workspace/cards/chat/ChatSources";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({
  message,
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-violet-600 text-white"
            : "border border-zinc-800 bg-zinc-900 text-zinc-200"
        }`}
      >
        <div className="mb-1 text-xs font-medium opacity-60">
          {isUser ? "You" : "KnowledgeHub AI"}
        </div>

        <div className="text-sm leading-6">
          {isUser ? (
            <div className="whitespace-pre-wrap">
              {message.content || "..."}
            </div>
          ) : (
            <MarkdownMessage
              content={message.content || "..."}
            />
          )}
        </div>

        {!isUser &&
          message.sources &&
          message.sources.length > 0 && (
            <ChatSources
              sources={message.sources}
            />
          )}
      </div>
    </div>
  );
}