"use client";

import UploadArea from "./upload/UploadArea";
import UploadProgress from "./upload/UploadProgress";
import UploadSuccess from "./upload/UploadSuccess";
import UploadError from "./upload/UploadError";

import { useUpload } from "@/hooks/useUpload";

export default function UploadCard() {
  const {
    upload,
    loading,
    progress,
    success,
    error,
    document,
    reset,
  } = useUpload();

  const handleFiles = (files: File[]) => {
    if (!files.length) return;

    upload(files[0]);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <UploadProgress progress={progress} />
      );
    }

    if (success && document) {
      return (
        <UploadSuccess
          filename={document.original_filename}
          onUploadAnother={reset}
        />
      );
    }

    if (error) {
      return (
        <UploadError
          message={error}
          onRetry={reset}
        />
      );
    }

    return (
      <UploadArea
        onFilesSelected={handleFiles}
      />
    );
  };

  return (
    <div className="flex h-full flex-col gap-2">
      <div>
        <p className="text-xs text-zinc-500">
          Knowledge
        </p>

        <h2 className="mt-1 text-lg font-semibold text-white">
          Upload Documents
        </h2>

        <p className="mt-1 text-xs text-zinc-500">
          Drag & drop PDFs, DOCX or TXT files.
        </p>
      </div>

      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
}