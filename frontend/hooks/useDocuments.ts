"use client";

import { useEffect } from "react";

import { api } from "@/lib/api";

import { useDocumentStore } from "@/stores/documentStore";

import { DocumentListItem } from "@/types/document";

export function useDocuments() {
  const {
    documents,
    loading,
    setDocuments,
    setLoading,
  } = useDocumentStore();

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const response =
        await api.get<DocumentListItem[]>(
          "/documents"
        );

      setDocuments(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documents.length === 0) {
      fetchDocuments();
    }
  }, []);

  return {
    documents,
    loading,
    refresh: fetchDocuments,
  };
}