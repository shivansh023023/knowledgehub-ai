"use client";

import { SearchResult } from "@/types/search";

interface Props {
  result: SearchResult;
}

export default function SearchResultCard({
  result,
}: Props) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-white">
          {result.document_name}
        </h3>

        <span className="text-xs text-violet-400">
          {(result.score * 100).toFixed(1)}%
        </span>
      </div>

      <p className="mt-2 line-clamp-3 text-sm text-zinc-400">
        {result.content}
      </p>
    </div>
  );
}