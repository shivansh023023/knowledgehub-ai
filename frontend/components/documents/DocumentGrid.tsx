"use client";

import DocumentCard from "./DocumentCard";

import { DocumentListItem } from "@/types/document";

interface Props {
  documents: DocumentListItem[];
  onDelete?: (id: string) => void;
}

export default function DocumentGrid({
  documents,
  onDelete,
}: Props) {
  if (!documents.length) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-800 py-20 text-center">
        <h3 className="text-lg font-medium text-white">
          No documents yet
        </h3>

        <p className="mt-2 text-zinc-500">
          Upload your first document to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}