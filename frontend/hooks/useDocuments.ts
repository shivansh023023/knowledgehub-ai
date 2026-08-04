"use client";

import { useCallback, useEffect, useState } from "react";

import { api, deleteDocument } from "@/lib/api";
import { DocumentListItem } from "@/types/document";

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response =
        await api.get<DocumentListItem[]>("/documents");

      setDocuments(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const removeDocument = async (id: string) => {

    try {
      await deleteDocument(id);

      setDocuments((prev) =>
        prev.filter((doc) => doc.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete document.");
    }
  };

  return {
    documents,
    loading,
    error,
    refresh: fetchDocuments,
    removeDocument,
  };
}