"use client";

import {
  FileText,
  Trash2,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  FileCode,
  File as FileIconLucide,
  Presentation,
} from "lucide-react";

import { DocumentListItem } from "@/types/document";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface Props {
  document: DocumentListItem;
  onDelete?: (id: string) => void;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "READY":
      return {
        label: "Ready",
        className:
          "bg-green-500/10 text-green-400 border border-green-500/20",
      };
    case "FAILED":
      return {
        label: "Failed",
        className:
          "bg-red-500/10 text-red-400 border border-red-500/20",
      };
    case "UPLOADING":
      return {
        label: "Uploading",
        className:
          "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      };
    case "PARSING":
      return {
        label: "Parsing",
        className:
          "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
      };
    case "CHUNKING":
      return {
        label: "Chunking",
        className:
          "bg-orange-500/10 text-orange-400 border border-orange-500/20",
      };
    case "EMBEDDING":
      return {
        label: "Embedding",
        className:
          "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
      };
    case "GRAPH_BUILDING":
      return {
        label: "Graph",
        className:
          "bg-purple-500/10 text-purple-400 border border-purple-500/20",
      };
    default:
      return {
        label: status,
        className:
          "bg-zinc-700/40 text-zinc-300 border border-zinc-700",
      };
  }
}

function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  switch (ext) {
    case 'pdf': return { icon: FileText, color: 'text-red-400', bg: 'bg-red-500/10' };
    case 'doc':
    case 'docx': return { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' };
    case 'xls':
    case 'xlsx':
    case 'csv': return { icon: FileSpreadsheet, color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    case 'ppt':
    case 'pptx': return { icon: Presentation, color: 'text-orange-400', bg: 'bg-orange-500/10' };
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg': return { icon: FileImage, color: 'text-purple-400', bg: 'bg-purple-500/10' };
    case 'zip':
    case 'rar':
    case 'tar':
    case 'gz': return { icon: FileArchive, color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
    case 'json':
    case 'js':
    case 'ts':
    case 'py':
    case 'tsx':
    case 'jsx':
    case 'html':
    case 'css': return { icon: FileCode, color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
    case 'txt':
    case 'md': return { icon: FileText, color: 'text-zinc-400', bg: 'bg-zinc-500/10' };
    default: return { icon: FileIconLucide, color: 'text-violet-400', bg: 'bg-violet-500/10' };
  }
}

function formatRelativeTime(dateString: string) {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

export default function DocumentCard({
  document,
  onDelete,
}: Props) {
  const size = (document.file_size / 1024 / 1024).toFixed(2);
  const badge = getStatusBadge(document.status);
  const fileType = getFileIcon(document.original_filename);
  const Icon = fileType.icon;
  const timeStr = formatRelativeTime(document.created_at);

  return (
    <div
      className="
        flex
        items-center
        justify-between
        rounded-xl
        border
        border-zinc-800
        bg-zinc-900/60
        px-5
        py-4
        transition-all
        duration-200
        hover:border-violet-500/50
        hover:bg-zinc-800/50
        hover:shadow-md
        hover:shadow-violet-500/5
      "
    >
      {/* Left Content */}
      <div className="flex items-center gap-4 min-w-0">
        <div className={`shrink-0 rounded-lg ${fileType.bg} p-3`}>
          <Icon className={`h-5 w-5 ${fileType.color}`} />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-medium text-zinc-100">
            {document.original_filename}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
            <span>{size} MB</span>
            <span>•</span>
            <span>{timeStr}</span>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex shrink-0 items-center gap-4 pl-4">
        <span
          className={`
            hidden sm:inline-flex
            rounded-full
            px-2.5
            py-1
            text-xs
            font-medium
            ${badge.className}
          `}
        >
          {badge.label}
        </span>

        <Dialog>
          <DialogTrigger
            render={
              <button
                className="
        rounded-lg
        p-2.5
        text-zinc-400
        transition-colors
        hover:bg-red-500/10
        hover:text-red-400
      "
                aria-label="Delete document"
              />
            }
          >
            <Trash2 className="h-4 w-4" />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-100">
            <DialogHeader>
              <DialogTitle className="text-xl">Delete Document</DialogTitle>
              <DialogDescription className="text-zinc-400 mt-2">
                Are you sure you want to delete <span className="font-semibold text-zinc-300">{document.original_filename}</span>? This action is permanent and cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 flex gap-2 border-none bg-transparent">
              <DialogClose
                render={
                  <button
                    className="
        rounded-lg
        px-4
        py-2
        font-medium
        text-zinc-300
        transition-colors
        hover:bg-zinc-800
        hover:text-white
      "
                  />
                }
              >
                Cancel
              </DialogClose>
              <button
                onClick={() => onDelete?.(document.id)}
                className="rounded-lg bg-red-500/10 px-4 py-2 font-medium text-red-500 hover:bg-red-500/20 transition-colors"
              >
                Delete
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}