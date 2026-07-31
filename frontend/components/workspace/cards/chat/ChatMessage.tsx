"use client";

import { Message } from "@/types/chat";
import ChatSources from "./ChatSources";
import MarkdownMessage from "./MarkdownMessage";
import CopyButton from "./CopyButton";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({
  message,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className="group space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
              isUser
                ? "bg-violet-600 text-white"
                : "bg-zinc-800 text-zinc-300"
            }`}
          >
            {isUser ? "U" : "AI"}
          </div>

          <span className="text-sm font-medium text-zinc-300">
            {isUser ? "You" : "KnowledgeHub AI"}
          </span>
        </div>

        {!isUser && (
          <div className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <CopyButton text={message.content} />
          </div>
        )}
      </div>

      {/* Message */}
      <div className="pl-10">
        {isUser ? (
          <div className="whitespace-pre-wrap text-[15px] leading-7 text-zinc-100">
            {message.content}
          </div>
        ) : (
          <MarkdownMessage content={message.content} />
        )}

        {!isUser &&
          message.sources &&
          message.sources.length > 0 && (
            <div className="mt-6">
              <ChatSources sources={message.sources} />
            </div>
          )}
      </div>
    </div>
  );
}