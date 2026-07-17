"use client";

import { Search, Upload } from "lucide-react";

interface KnowledgeHeaderProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function KnowledgeHeader({
  search,
  setSearch,
}: KnowledgeHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Knowledge Base
        </h1>

        <p className="mt-2 text-zinc-400">
          Manage and search your uploaded documents.
        </p>
      </div>

      {/* Right */}
      <div className="flex gap-3">

        {/* Search */}
        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-72 rounded-xl border border-zinc-700 bg-zinc-900 py-2 pl-10 pr-4 text-white outline-none transition focus:border-blue-500"
          />

        </div>

        {/* Upload Button */}
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700">

          <Upload size={18} />

          Upload

        </button>

      </div>

    </div>
  );
}