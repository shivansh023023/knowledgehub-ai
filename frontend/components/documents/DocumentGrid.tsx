"use client";

import { Inbox, UploadCloud } from "lucide-react";
import DocumentCard from "./DocumentCard";

import { DocumentListItem } from "@/types/document";

interface Props {
  documents: DocumentListItem[];
  onDelete?: (id: string) => void;
  onUploadClick?: () => void;
}

export default function DocumentGrid({
  documents,
  onDelete,
  onUploadClick,
}: Props) {
  if (!documents.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800/60 bg-zinc-900/20 py-32 text-center transition-colors hover:bg-zinc-900/40">
        <div className="rounded-full bg-zinc-800/50 p-4 mb-4 ring-8 ring-zinc-900/50">
          <Inbox className="h-8 w-8 text-zinc-400" />
        </div>
        <h3 className="text-xl font-semibold text-zinc-100">
          No documents yet
        </h3>
        <p className="mt-2 mb-6 max-w-sm text-sm text-zinc-400">
          Upload your first document to start building your knowledge base. Supported formats include PDF, Word, Excel, and more.
        </p>
        <button
          onClick={onUploadClick}
          className="flex items-center gap-2 rounded-lg bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-white shadow-sm"
        >
          <UploadCloud className="h-4 w-4" />
          Upload Document
        </button>
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