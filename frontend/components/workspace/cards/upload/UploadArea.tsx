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
        flex h-56 cursor-pointer flex-col items-center justify-center
        rounded-2xl border-2 border-dashed
        transition-all duration-200
        ${
          isDragActive
            ? "border-violet-500 bg-violet-500/10"
            : "border-zinc-700 hover:border-violet-500"
        }
      `}
    >
      <input {...getInputProps()} />

      <UploadCloud className="mb-4 h-12 w-12 text-violet-400" />

      <p className="font-medium text-white">
        {isDragActive
          ? "Drop your files here"
          : "Drag & Drop files"}
      </p>

      <p className="mt-2 text-sm text-zinc-400">
        or click to browse
      </p>

      <p className="mt-6 text-xs text-zinc-500">
        PDF • DOCX • TXT
      </p>
    </div>
  );
}