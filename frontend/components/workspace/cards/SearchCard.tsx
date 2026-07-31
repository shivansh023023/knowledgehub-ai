"use client";

import SearchInput from "./search/SearchInput";
import SearchResults from "./search/SearchResults";

import { useSearch } from "@/hooks/useSearch";

export default function SearchCard() {
  const {
    query,
    setQuery,
    results,
    loading,
    error,
    search,
  } = useSearch();

  return (
    <div className="flex h-full flex-col gap-2">
      <div>
        <p className="text-xs text-zinc-500">
          Retrieval
        </p>

        <h2 className="mt-1 text-lg font-semibold text-white">
          Semantic Search
        </h2>

        <p className="mt-1 text-xs text-zinc-500">
          Search across your uploaded documents.
        </p>
      </div>

      <SearchInput
        value={query}
        loading={loading}
        onChange={setQuery}
        onSearch={() => search(query)}
      />

      <div className="flex-1 overflow-y-auto">
        <SearchResults
          results={results}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}