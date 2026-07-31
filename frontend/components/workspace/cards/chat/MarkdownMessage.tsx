"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface MarkdownMessageProps {
  content: string;
}

export default function MarkdownMessage({
  content,
}: MarkdownMessageProps) {
  return (
    <div
      className="
        prose
        prose-sm
        prose-invert
        max-w-none

        prose-headings:mt-5
        prose-headings:mb-3
        prose-headings:font-semibold

        prose-p:my-3
        prose-p:leading-7

        prose-ul:my-3
        prose-ol:my-3
        prose-li:my-1

        prose-table:my-4

        prose-pre:my-4
        prose-pre:overflow-x-auto
        prose-pre:rounded-xl
        prose-pre:border
        prose-pre:border-zinc-700
        prose-pre:bg-zinc-950
        prose-pre:p-4

        prose-blockquote:my-4
        prose-blockquote:border-violet-500
        prose-blockquote:text-zinc-300

        prose-headings:text-white
        prose-p:text-zinc-100
        prose-strong:text-white
        prose-a:text-violet-400
        prose-code:text-violet-300
      "
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table>{children}</table>
            </div>
          ),

          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-violet-500 pl-4 italic text-zinc-300">
              {children}
            </blockquote>
          ),

          code: ({ className, children, ...props }) => {
            // Code block
            if (className) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            // Inline code
            return (
              <code
                className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-violet-300"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}