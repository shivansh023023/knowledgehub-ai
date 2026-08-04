"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import UploadArea from "@/components/workspace/cards/upload/UploadArea";
import UploadProgress from "@/components/workspace/cards/upload/UploadProgress";
import UploadSuccess from "@/components/workspace/cards/upload/UploadSuccess";
import UploadError from "@/components/workspace/cards/upload/UploadError";

import { useUpload } from "@/hooks/useUpload";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  onUploaded?: () => void;
}

export default function UploadDialog({
  open,
  onOpenChange,
  onUploaded,
}: Props) {
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

  const handleComplete = () => {
    reset();

    onOpenChange(false);

    onUploaded?.();
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
          autoClose
          onComplete={handleComplete}
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
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) reset();

        onOpenChange(value);
      }}
    >
      <DialogContent className="max-w-xl border-zinc-800 bg-zinc-900">
        <DialogHeader>
          <DialogTitle>
            Upload Documents
          </DialogTitle>
        </DialogHeader>

        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}