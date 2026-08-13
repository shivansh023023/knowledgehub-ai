"use client";

import { Message } from "@/types/chat";
import MarkdownMessage from "@/components/workspace/cards/chat/MarkdownMessage";

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

        {message.sources &&
          message.sources.length > 0 && (
            <div className="mt-4 border-t border-zinc-700 pt-3">
              <p className="mb-2 text-xs font-semibold text-zinc-400">
                Sources
              </p>

              <div className="space-y-1">
                {message.sources.map(
                  (source, index) => (
                    <div
                      key={`${source.document_id}-${index}`}
                      className="text-xs text-zinc-500"
                    >
                      📄 {source.document_name}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}