"use client";

import { useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import KnowledgeHeader from "../../components/knowledge/KnowledgeHeader";
import KnowledgeTable from "../../components/knowledge/KnowledgeTable";

export default function KnowledgePage() {
  const [search, setSearch] = useState("");

  return (
    <DashboardLayout>
      <KnowledgeHeader
        search={search}
        setSearch={setSearch}
      />

      <KnowledgeTable
        search={search}
      />
    </DashboardLayout>
  );
}