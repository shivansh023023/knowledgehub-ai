"use client";

import { useDocuments } from "@/components/providers/DocumentProvider";
import UploadCard from "@/components/upload/UploadCard";

export default function WorkspaceContent() {
  const { documents } = useDocuments();

  if (documents.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <UploadCard />
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center">
      <h2 className="text-2xl font-semibold">
        Chat UI Coming Soon 🚀
      </h2>
    </div>
  );
}