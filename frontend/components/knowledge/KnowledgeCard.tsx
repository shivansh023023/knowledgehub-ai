import {
  FileText,
  FileCode,
  FileArchive,
} from "lucide-react";

interface KnowledgeCardProps {
  name: string;
  size: string;
  status: "Ready" | "Processing";
  uploadedAt: string;
}

function getIcon(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return <FileText className="text-red-500" size={22} />;

    case "doc":
    case "docx":
      return <FileText className="text-blue-500" size={22} />;

    case "md":
      return <FileCode className="text-green-500" size={22} />;

    default:
      return <FileArchive className="text-zinc-400" size={22} />;
  }
}

export default function KnowledgeCard({
  name,
  size,
  status,
  uploadedAt,
}: KnowledgeCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-blue-500">

      <div className="flex items-start justify-between">

        <div className="flex items-center gap-4">

          {getIcon(name)}

          <div>

            <h3 className="font-semibold text-white">
              {name}
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              {size} • {uploadedAt}
            </p>

          </div>

        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            status === "Ready"
              ? "bg-green-500/15 text-green-400"
              : "bg-yellow-500/15 text-yellow-400"
          }`}
        >
          {status}
        </span>

      </div>

    </div>
  );
}