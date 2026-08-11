"use client";

import { FileText } from "lucide-react";
import { ChatSource } from "@/types/chat";

interface Props {
  sources: ChatSource[];
}

export default function ChatSources({ sources }: Props) {
  if (!sources.length) return null;

  const grouped = sources.reduce<
    Record<string, ChatSource[]>
  >((acc, source) => {
    if (!acc[source.document_id]) {
      acc[source.document_id] = [];
    }

    acc[source.document_id].push(source);

    return acc;
  }, {});

  return (
    <div className="mt-6 border-t border-zinc-800 pt-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
        Sources
      </p>

      <div className="space-y-3">
        {Object.values(grouped).map((documentSources) => {
          const first = documentSources[0];

          return (
            <div
              key={first.document_id}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 transition-all duration-200 hover:border-violet-500/40 hover:bg-zinc-900"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-zinc-800 p-2">
                  <FileText
                    size={16}
                    className="text-zinc-400"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-100">
                    {first.document_name}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                    <span>
                      {documentSources.length} relevant{" "}
                      {documentSources.length === 1
                        ? "section"
                        : "sections"}
                    </span>

                    <span>•</span>

                    <span>
                      Best match:{" "}
                      {(Math.max(
                        ...documentSources.map(
                          (source) => source.score
                        )
                      ) * 100).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}