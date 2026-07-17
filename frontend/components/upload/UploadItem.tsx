"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

import { UploadFile } from "./useUploadManager";
import { getFileIcon } from "./fileIcons";
import { useDocuments } from "../providers/DocumentProvider";

interface UploadItemProps {
  item: UploadFile;
  index: number;
  onRemove: (index: number) => void;
}

export default function UploadItem({
  item,
  index,
  onRemove,
}: UploadItemProps) {
  const { addDocument } = useDocuments();

  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);

  const hasAdded = useRef(false);

  useEffect(() => {
    console.log("UploadItem mounted:", item.file.name);
    let current = 0;

    const interval = setInterval(() => {
      current = Math.min(current + Math.random() * 20, 100);

      setProgress(current);

      if (current >= 100) {
        clearInterval(interval);

        setUploaded(true);

        if (!hasAdded.current) {
          hasAdded.current = true;
          console.log("🚀 Calling addDocument");
          addDocument({
            id: crypto.randomUUID(),
            name: item.file.name,
            size: `${(item.file.size / 1024).toFixed(1)} KB`,
            status: "Ready",
            uploadedAt: new Date().toLocaleString(),
          });
        }
      }
    }, 300);

    return () => clearInterval(interval);
  }, [addDocument, item.file]);

  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3">
      <div className="flex flex-1 items-center gap-3">
        {getFileIcon(item.file.name)}

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white">
              {item.file.name}
            </p>

            <span className="text-xs text-zinc-500">
              {(item.file.size / 1024).toFixed(1)} KB
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-700">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p className="mt-1 text-xs text-zinc-400">
            {uploaded
              ? "✅ Uploaded"
              : `Uploading... ${Math.round(progress)}%`}
          </p>
        </div>
      </div>

      <button
        onClick={() => onRemove(index)}
        className="ml-4 rounded-md p-2 text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
      >
        <X size={18} />
      </button>
    </div>
  );
}