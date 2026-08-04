"use client";

import { useMemo, useState } from "react";
import { Upload } from "lucide-react";

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

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) =>
      document.original_filename
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [documents, search]);

  return (
    <>
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploaded={refresh}
      />

      <div className="flex h-screen w-full flex-col px-8 py-6">
        {/* Header */}

        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-zinc-500">
              Knowledge
            </p>

            <h1 className="mt-1 text-4xl font-bold text-white">
              Documents
            </h1>

            <p className="mt-2 text-zinc-400">
              Manage all of your uploaded knowledge sources.
            </p>
          </div>

          <button
            onClick={() => setUploadOpen(true)}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-violet-600
              px-4
              py-2.5
              font-medium
              text-white
              transition
              hover:bg-violet-500
            "
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>
        </div>

        <div className="mt-6">
          <StatsCards documents={documents} />
        </div>

        <div className="mt-4">
          <SearchBar
            value={search}
            onChange={setSearch}
          />
        </div>

        <div className="mt-4 flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-zinc-500">
              Loading documents...
            </p>
          ) : error ? (
            <p className="text-red-400">
              {error}
            </p>
          ) : (
            <DocumentGrid
              documents={filteredDocuments}
              onDelete={removeDocument}
            />
          )}
        </div>
      </div>
    </>
  );
}