"use client";

import { useState } from "react";

import { api } from "@/lib/api";

import {
  SearchRequest,
  SearchResponse,
  SearchResult,
} from "@/types/search";

export function useSearch() {
  const [query, setQuery] = useState("");

  const [results, setResults] = useState<SearchResult[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const search = async (
    searchQuery: string,
    top_k = 5
  ) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const body: SearchRequest = {
        query: searchQuery,
        top_k,
      };

      const response =
        await api.post<SearchResponse>(
          "/search",
          body
        );

      setResults(response.data.results);
    } catch (err: any) {
  console.error("Axios Error:", err);

  console.log("Status:", err.response?.status);

  console.log("Data:", err.response?.data);

  setError("Search failed.");
} finally {
      setLoading(false);
    }
  };

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    search,
  };
}