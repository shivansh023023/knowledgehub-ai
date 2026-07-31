export interface SearchRequest {
  query: string;
  top_k?: number;
}

export interface SearchResult {
  chunk_id: string;
  document_id: string;
  document_name: string;
  chunk_index: number;
  content: string;
  score: number;
}

export interface SearchResponse {
  results: SearchResult[];
}