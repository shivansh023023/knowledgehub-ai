"use client";

import { useDocuments } from "../providers/DocumentProvider";

interface KnowledgeTableProps {
  search?: string;
}

export default function KnowledgeTable({
  search = "",
}: KnowledgeTableProps) {
  const { documents } = useDocuments();

  const filteredDocuments = documents.filter((document) =>
    document.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 text-white">
      <h1 className="mb-6 text-3xl">Knowledge Debug</h1>

      <p>Total documents: {filteredDocuments.length}</p>

      <pre className="mt-6 overflow-auto rounded bg-zinc-900 p-4 text-sm">
        {JSON.stringify(filteredDocuments, null, 2)}
      </pre>
    </div>
  );
}