"use client";

import { useDocuments } from "../providers/DocumentProvider";

export default function KnowledgeTable() {
  const { documents } = useDocuments();

  return (
    <div className="text-white p-8">
      <h1 className="text-3xl mb-6">Knowledge Debug</h1>

      <p>Total documents: {documents.length}</p>

      <pre className="mt-6 rounded bg-zinc-900 p-4 text-sm overflow-auto">
        {JSON.stringify(documents, null, 2)}
      </pre>
    </div>
  );
}