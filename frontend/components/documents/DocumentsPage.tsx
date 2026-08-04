"use client";

import { useMemo, useState } from "react";
import { Upload, ChevronDown } from "lucide-react";

import SearchBar from "./SearchBar";
import StatsCards from "./StatsCards";
import DocumentGrid from "./DocumentGrid";
import UploadDialog from "./UploadDialog";

import { useDocuments } from "@/hooks/useDocuments";

export default function DocumentsPage() {
  const {
    documents,
    loading,
    error,
    removeDocument,
    refresh,
  } = useDocuments();

  const [search, setSearch] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [filterStatus, setFilterStatus] = useState("All");

  const filterOptions = ["All", "Ready", "Processing", "Failed"];

  const filteredDocuments = useMemo(() => {
    let result = documents;

    // Filter by Search
    if (search) {
      result = result.filter((doc) =>
        doc.original_filename.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by Status
    if (filterStatus !== "All") {
      if (filterStatus === "Processing") {
        const processingStatuses = ["UPLOADING", "PARSING", "CHUNKING", "EMBEDDING", "GRAPH_BUILDING"];
        result = result.filter((doc) => processingStatuses.includes(doc.status));
      } else {
        result = result.filter((doc) => doc.status === filterStatus.toUpperCase());
      }
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "name-asc":
          return a.original_filename.localeCompare(b.original_filename);
        case "name-desc":
          return b.original_filename.localeCompare(a.original_filename);
        case "largest":
          return b.file_size - a.file_size;
        case "smallest":
          return a.file_size - b.file_size;
        default:
          return 0;
      }
    });

    return result;
  }, [documents, search, filterStatus, sortOption]);

  return (
    <>
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploaded={refresh}
      />

      <div className="flex h-screen w-full flex-col px-6 py-6 md:px-8 lg:px-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between shrink-0">
          <div>
            <p className="text-sm font-medium text-violet-400">
              Knowledge
            </p>
            <h1 className="mt-1 text-3xl md:text-4xl font-bold text-zinc-100">
              Documents
            </h1>
            <p className="mt-2 text-sm md:text-base text-zinc-400">
              Manage all of your uploaded knowledge sources.
            </p>
          </div>

          <button
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 font-medium text-white transition-all hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/20 active:scale-95"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
          </button>
        </div>

        <div className="mt-8 shrink-0">
          <StatsCards documents={documents} />
        </div>

        {/* Controls Row */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between shrink-0">
          <div className="w-full lg:max-w-md">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/50 p-1">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setFilterStatus(opt)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    filterStatus === opt
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none rounded-lg border border-zinc-800 bg-zinc-900/80 pl-3 pr-8 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="largest">Largest first</option>
                <option value="smallest">Smallest first</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            </div>
          </div>
        </div>

        {/* Document List */}
        <div className="mt-6 flex-1 overflow-y-auto pr-2 pb-10 custom-scrollbar">
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-4"
                >
                  <div className="flex items-center gap-4 w-full">
                    <div className="h-11 w-11 shrink-0 rounded-lg bg-zinc-800/50 animate-pulse" />
                    <div className="space-y-2 w-full max-w-[200px]">
                      <div className="h-4 w-full rounded bg-zinc-800/50 animate-pulse" />
                      <div className="h-3 w-3/4 rounded bg-zinc-800/30 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-4 pl-4">
                    <div className="hidden sm:block h-6 w-16 rounded-full bg-zinc-800/50 animate-pulse" />
                    <div className="h-9 w-9 rounded-lg bg-zinc-800/50 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-red-400 font-medium">{error}</p>
              <button onClick={refresh} className="mt-4 text-sm text-zinc-400 hover:text-white underline underline-offset-2">Try again</button>
            </div>
          ) : (
            <DocumentGrid
              documents={filteredDocuments}
              onDelete={removeDocument}
              onUploadClick={() => setUploadOpen(true)}
            />
          )}
        </div>
      </div>
    </>
  );
}