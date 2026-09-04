"use client";

import ChatInput from "./chat/ChatInput";
import ChatMessages from "./chat/ChatMessages";

import { useChat } from "@/hooks/useChat";
import { useChatStore } from "@/stores/chatStore";
import { useDocuments } from "@/hooks/useDocuments";

export default function ChatCard() {
  const {
    messages,
    loading,
    error,
    sendMessage,
    selectedDocumentId,
  } = useChat();

  const setSelectedDocumentId =
    useChatStore(
      (state) => state.setSelectedDocumentId
    );

  const {
    documents,
    loading: documentsLoading,
    error: documentsError,
  } = useDocuments();

  const selectedDocument = documents.find(
    (document) =>
      document.id === selectedDocumentId
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4">
        <p className="text-xs uppercase tracking-wider text-zinc-500">
          KnowledgeHub AI
        </p>

        <h2 className="mt-1 text-2xl font-semibold text-white">
          AI Assistant
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          Ask questions about your uploaded documents.
        </p>

        {/* Document selector */}
        <div className="mt-4">
          <label
            htmlFor="document-selector"
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-zinc-500"
          >
            Search scope
          </label>

          <select
            id="document-selector"
            value={selectedDocumentId ?? ""}
            onChange={(event) => {
              setSelectedDocumentId(
                event.target.value || null
              );
            }}
            disabled={
              documentsLoading ||
              loading
            }
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none transition-colors focus:border-violet-500/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">
              All Documents
            </option>

            {documents
              .filter(
                (document) =>
                  document.status === "READY"
              )
              .map((document) => (
                <option
                  key={document.id}
                  value={document.id}
                >
                  {document.original_filename}
                </option>
              ))}
          </select>

          {documentsError && (
            <p className="mt-2 text-xs text-red-400">
              {documentsError}
            </p>
          )}

          {!documentsLoading &&
            !documentsError &&
            documents.length === 0 && (
              <p className="mt-2 text-xs text-zinc-500">
                No documents uploaded yet.
              </p>
            )}

          {!documentsLoading &&
            selectedDocument && (
              <p className="mt-2 text-xs text-zinc-500">
                Searching only in{" "}
                <span className="text-zinc-300">
                  {selectedDocument.original_filename}
                </span>
              </p>
            )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-900/50 bg-red-950/20 p-3">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6">
        <ChatMessages
          messages={messages}
          loading={loading}
        />
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 pt-4">
        <ChatInput
          loading={loading}
          onSend={sendMessage}
        />
      </div>
    </div>
  );
}