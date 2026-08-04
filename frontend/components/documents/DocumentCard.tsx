"use client";

import {
  FileText,
  Trash2,
} from "lucide-react";

import { DocumentListItem } from "@/types/document";

interface Props {
  document: DocumentListItem;
  onDelete?: (id: string) => void;
}

export default function DocumentCard({
  document,
  onDelete,
}: Props) {
  const size =
    (document.file_size / 1024 / 1024).toFixed(2);

  return (
    <div
      className="
      flex
      items-center
      justify-between

      rounded-xl
      border
      border-zinc-800

      bg-zinc-900/70

      px-5
      py-3

      transition-all
      duration-200

      hover:border-violet-500
      hover:bg-zinc-800/40
      hover:shadow-lg
      hover:shadow-violet-500/10
    "
    >
      {/* Left */}

      <div className="flex items-center gap-4">
        <div className="rounded-lg bg-violet-500/10 p-2.5">
          <FileText className="h-5 w-5 text-violet-400" />
        </div>

        <div>
          <h3 className="text-[15px] font-medium text-white">
            {document.original_filename}
          </h3>

          <p className="mt-1 text-sm text-zinc-500">
            {size} MB
          </p>
        </div>
      </div>

      {/* Right */}

      <div className="flex items-center gap-4">
        <span
          className="
            rounded-full
            bg-green-500/10
            px-3
            py-1

            text-xs
            font-medium
            text-green-400
          "
        >
          Ready
        </span>

        <button
          onClick={() => onDelete?.(document.id)}
          className="
            rounded-lg
            p-2
            transition
            hover:bg-red-500/10
          "
        >
          <Trash2 className="h-5 w-5 text-red-400" />
        </button>
      </div>
    </div>
  );
}