import { create } from "zustand";

import { Document, DocumentListItem } from "@/types/document";

interface DocumentStore {
  documents: DocumentListItem[];

  loading: boolean;

  setDocuments: (documents: DocumentListItem[]) => void;

  addDocument: (document: Document) => void;

  removeDocument: (id: string) => void;

  setLoading: (loading: boolean) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],

  loading: true,

  setDocuments: (documents) =>
    set({
      documents,
    }),

  addDocument: (document) =>
    set((state) => ({
      documents: [
        {
          id: document.id,
          original_filename: document.original_filename,
          file_size: document.file_size,
          status: document.status,
          created_at: document.created_at,
        },
        ...state.documents,
      ],
    })),

  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter(
        (doc) => doc.id !== id
      ),
    })),

  setLoading: (loading) =>
    set({
      loading,
    }),
}));