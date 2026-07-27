"use client";

import { useState } from "react";
import { AxiosProgressEvent } from "axios";

import { api } from "@/lib/api";
import { useDocumentStore } from "@/stores/documentStore";

import {
  Document,
  UploadResponse,
} from "@/types/document";

export function useUpload() {
  const addDocument = useDocumentStore(
    (state) => state.addDocument
  );

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState(false);

  const [document, setDocument] =
    useState<Document | null>(null);

  const upload = async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setProgress(0);

      const formData = new FormData();

      formData.append("file", file);

      const response =
        await api.post<UploadResponse>(
          "/documents/upload",
          formData,
          {
            onUploadProgress: (
              event: AxiosProgressEvent
            ) => {
              if (!event.total) return;

              setProgress(
                Math.round(
                  (event.loaded * 100) /
                    event.total
                )
              );
            },
          }
        );

      console.log(
        "Upload Response:",
        response.data
      );

      setDocument(response.data.document);

      addDocument(response.data.document);

      setSuccess(true);
    } catch (err) {
      console.error(err);

      setError("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setProgress(0);
    setSuccess(false);
    setError(null);
    setDocument(null);
  };

  return {
    upload,
    loading,
    progress,
    success,
    error,
    document,
    reset,
  };
}