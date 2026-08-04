"use client";

import { DocumentListItem } from "@/types/document";

interface Props {
  documents: DocumentListItem[];
}

export default function StatsCards({
  documents,
}: Props) {
  const totalDocuments = documents.length;

  const readyDocuments = documents.filter(
    (doc) => doc.status === "READY"
  ).length;

  const totalSize = documents.reduce(
    (sum, doc) => sum + doc.file_size,
    0
  );

  const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);

  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard
        title="Documents"
        value={String(totalDocuments)}
      />

      <StatCard
        title="Storage"
        value={`${sizeInMB} MB`}
      />

      <StatCard
        title="Ready"
        value={String(readyDocuments)}
      />
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-zinc-800
        bg-zinc-900

        px-5
        py-3
      "
    >
      <p className="text-xs uppercase tracking-wide text-zinc-500">
        {title}
      </p>

      <h3 className="mt-1 text-2xl font-bold text-white">
        {value}
      </h3>
    </div>
  );
}