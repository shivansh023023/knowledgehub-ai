"use client";

import UploadCard from "./cards/UploadCard";
import KnowledgeBaseCard from "./cards/KnowledgeBaseCard";
import ModelCard from "./cards/ModelCard";
import GraphRAGCard from "./cards/GraphRAGCard";
import SearchCard from "./cards/SearchCard";

export default function Sidebar() {
  return (
    <div className="flex h-full flex-col gap-4">
      <UploadCard />

      <KnowledgeBaseCard />

      <div className="grid grid-cols-2 gap-4">
        <ModelCard />
        <GraphRAGCard />
      </div>

      <SearchCard />
    </div>
  );
}