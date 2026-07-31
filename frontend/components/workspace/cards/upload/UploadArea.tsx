"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

interface UploadAreaProps {
  onFilesSelected: (files: File[]) => void;
}

export default function UploadArea({
  onFilesSelected,
}: UploadAreaProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "text/plain": [".txt"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`
        flex h-28 cursor-pointer flex-col items-center justify-center
        rounded-xl border-2 border-dashed
        transition-all duration-200
        ${
          isDragActive
            ? "border-violet-500 bg-violet-500/10"
            : "border-zinc-700 hover:border-violet-500"
        }
      `}
    >
      <input {...getInputProps()} />

      <UploadCloud className="mb-2 h-8 w-8 text-violet-400" />

      <p className="text-sm font-medium text-white">
        {isDragActive
          ? "Drop your files here"
          : "Drag & Drop files"}
      </p>

      <p className="mt-1 text-xs text-zinc-400">
        or click to browse
      </p>

      <p className="mt-2 text-xs text-zinc-500">
        PDF • DOCX • TXT
      </p>
    </div>
  );
}