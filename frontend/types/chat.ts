export interface ChatRequest {
  conversationId: string | null;

  documentId: string | null;

  question: string;
}

export interface ChatSource {
  document_id: string;
  document_name: string;
  chunk_index: number;
  score: number;
  rerank_score?: number;
}

export interface ChatResponse {
  conversationId: string | null;

  answer: string;

  sources: ChatSource[];
}

export interface Message {
  id: string;

  role: "user" | "assistant";

  content: string;

  sources?: ChatSource[];
}