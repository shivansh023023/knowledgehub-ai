export interface ChatRequest {
  question: string;
}

export interface ChatSource {
  document_id: string;
  document_name: string;
  chunk_index: number;
  score: number;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
}

export interface Message {
  id: string;

  role: "user" | "assistant";

  content: string;

  sources?: ChatSource[];
}