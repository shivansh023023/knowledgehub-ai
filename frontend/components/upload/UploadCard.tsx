"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";

import { useUploadManager } from "./useUploadManager";
import UploadItem from "./UploadItem";

export default function UploadCard() {
  const [dragActive, setDragActive] = useState(false);

  const { files, addFiles, removeFile } = useUploadManager();

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragActive(false);

        const droppedFiles = Array.from(e.dataTransfer.files);

        if (droppedFiles.length > 0) {
          addFiles(droppedFiles);
        }
      }}
      className={`mx-auto flex w-full max-w-3xl flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all duration-300 ${
        dragActive
          ? "scale-[1.02] border-blue-500 bg-blue-500/10"
          : "border-zinc-700 bg-zinc-900/40 hover:border-blue-500"
      }`}
    >
      <UploadCloud
        size={64}
        className={`mb-6 transition-colors duration-300 ${
          dragActive ? "text-blue-400" : "text-blue-500"
        }`}
      />

      <h2 className="text-2xl font-bold text-white">
        Upload your documents
      </h2>

      <p className="mt-3 text-center text-zinc-400">
        Drag & drop PDF, DOCX, TXT or Markdown files here.
      </p>

      <input
        id="file-upload"
        type="file"
        className="hidden"
        multiple
        accept=".pdf,.doc,.docx,.txt,.md"
        onChange={(e) => {
          if (!e.target.files) return;

          addFiles(Array.from(e.target.files));
          e.currentTarget.value = "";
        }}
      />

      <label
        htmlFor="file-upload"
        className="mt-8 cursor-pointer rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Choose Files
      </label>

      {files.length > 0 && (
        <div className="mt-6 flex w-full flex-col gap-3">
          {files.map((item, index) => (
            <UploadItem
              key={item.id}
              item={item}
              index={index}
              onRemove={removeFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}