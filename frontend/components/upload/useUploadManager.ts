"use client";

import { useState } from "react";

export interface UploadFile {
  id: string;
  file: File;
}

export function useUploadManager() {
  const [files, setFiles] = useState<UploadFile[]>([]);

  function addFiles(newFiles: File[]) {
    setFiles((prev) => {
      const existing = new Set(prev.map((item) => item.file.name));

      const filtered = newFiles
        .filter((file) => !existing.has(file.name))
        .map((file) => ({
          id: crypto.randomUUID(),
          file,
        }));

      return [...prev, ...filtered];
    });
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  return {
    files,
    addFiles,
    removeFile,
  };
}