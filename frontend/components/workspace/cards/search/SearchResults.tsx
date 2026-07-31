"use client";

import { SearchResult } from "@/types/search";

import SearchResultCard from "./SearchResultCard";

interface Props {
  results: SearchResult[];
  loading: boolean;
  error: string | null;
}

export default function SearchResults({
  results,
  loading,
  error,
}: Props) {
  if (loading) {
    return (
      <p className="text-zinc-500">
        Searching...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-400">
        {error}
      </p>
    );
  }

  if (results.length === 0) {
    return (
      <p className="text-zinc-500">
        No results yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((result) => (
        <SearchResultCard
          key={result.chunk_id}
          result={result}
        />
      ))}
    </div>
  );
}