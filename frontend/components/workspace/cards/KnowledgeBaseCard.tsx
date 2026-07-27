"use client";

import { Database } from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";

export default function KnowledgeBaseCard() {
  const {
    documents,
    loading,
  } = useDocuments();

  if (loading) {
    return (
      <div>
        <p className="text-sm text-zinc-400">
          Database
        </p>

        <h3 className="mt-2 text-xl font-semibold text-white">
          Knowledge Base
        </h3>

        <p className="mt-8 text-zinc-500">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2">
        <Database
          className="text-violet-400"
          size={20}
        />

        <p className="text-sm text-zinc-400">
          Database
        </p>
      </div>

      <h3 className="mt-3 text-xl font-semibold text-white">
        Knowledge Base
      </h3>

      <div className="mt-8">
        <p className="text-4xl font-bold text-white">
          {documents.length}
        </p>

        <p className="text-zinc-500">
          Documents Indexed
        </p>
      </div>
    </div>
  );
}