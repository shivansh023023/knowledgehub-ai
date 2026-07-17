import {
  FileArchive,
  FileCode,
  FileText,
} from "lucide-react";

export function getFileIcon(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return <FileText className="text-red-500" size={22} />;

    case "doc":
    case "docx":
      return <FileText className="text-blue-500" size={22} />;

    case "md":
      return <FileCode className="text-green-500" size={22} />;

    case "txt":
      return <FileArchive className="text-yellow-500" size={22} />;

    default:
      return <FileText className="text-zinc-400" size={22} />;
  }
}