"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export interface DocumentItem {
  id: string;
  name: string;
  size: string;
  status: "Ready" | "Processing";
  uploadedAt: string;
}

interface DocumentContextType {
  documents: DocumentItem[];
  addDocument: (document: DocumentItem) => void;
  removeDocument: (id: string) => void;
}

const DocumentContext =
  createContext<DocumentContextType | null>(null);

export function DocumentProvider({
  children,
}: {
  children: ReactNode;
}) {
const [documents, setDocuments] = useState<DocumentItem[]>([]);

  function addDocument(document: DocumentItem) {
    console.log("📄 Adding document:", document);

    setDocuments((prev) => {
      const next = [...prev, document];

      console.log("📚 Documents after add:", next);

      return next;
    });
  }

  function removeDocument(id: string) {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  }

  // Debug log to see whether the provider is keeping its state
  console.log("📦 Current documents in provider:", documents);

  return (
    <DocumentContext.Provider
      value={{
        documents,
        addDocument,
        removeDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);

  if (!context) {
    throw new Error(
      "useDocuments must be used inside DocumentProvider"
    );
  }

  return context;
}