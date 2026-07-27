export type DocumentStatus =
  | "UPLOADING"
  | "UPLOADED"
  | "PARSING"
  | "CHUNKING"
  | "EMBEDDING"
  | "GRAPH_BUILDING"
  | "READY"
  | "FAILED";

export interface Document {
  id: string;

  filename: string;

  original_filename: string;

  mime_type: string;

  file_size: number;

  status: DocumentStatus;

  created_at: string;

  updated_at: string;
}

export interface UploadResponse {
  message: string;

  document: Document;
}

export interface DocumentListItem {
  id: string;

  original_filename: string;

  file_size: number;

  status: DocumentStatus;

  created_at: string;
}