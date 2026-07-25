# 📚 KnowledgeHub AI

> An intelligent RAG (Retrieval-Augmented Generation) platform that lets users upload documents and chat with them using state-of-the-art semantic search and Large Language Models.

![Python](https://img.shields.io/badge/Python-3.12-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688)
![Next.js](https://img.shields.io/badge/Next.js-Frontend-black)
![Qdrant](https://img.shields.io/badge/Qdrant-Vector%20Database-red)
![Groq](https://img.shields.io/badge/Groq-LLM-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Overview

KnowledgeHub AI enables users to upload documents, automatically process them into semantic embeddings, and interact with them through a conversational AI interface.

Instead of relying solely on an LLM's pretrained knowledge, the system retrieves relevant information from uploaded documents and uses it as context to generate accurate, grounded responses with source references.

---

## 🚀 Features

### 📄 Document Processing

- Upload PDF documents
- Automatic text extraction
- Intelligent document chunking
- Vector embedding generation
- Semantic indexing using Qdrant

### 🔍 Semantic Search

- Dense vector similarity search
- Fast retrieval of relevant chunks
- High-quality embeddings using BAAI BGE
- Source-aware search results

### 💬 AI Chat

- Retrieval-Augmented Generation (RAG)
- Context-aware responses
- Powered by Groq LLM
- Source citations for every response

### ⚙️ Backend

- FastAPI
- SQLAlchemy ORM
- Alembic migrations
- Modular service architecture
- Repository pattern
- RESTful API
- Automatic OpenAPI documentation

---

# 🏗️ Architecture

```text
                 Upload PDF
                      │
                      ▼
              Document Parser
                      │
                      ▼
              Text Chunking
                      │
                      ▼
             Generate Embeddings
                      │
                      ▼
          Store Vectors (Qdrant)
                      │
                      ▼
              Semantic Search
                      │
                      ▼
            Retrieve Top Chunks
                      │
                      ▼
               Prompt Builder
                      │
                      ▼
                 Groq LLM
                      │
                      ▼
      AI Response + Source References
```

---

# 🛠️ Tech Stack

## Backend

- FastAPI
- SQLAlchemy
- Alembic
- SQLite
- Pydantic v2

## AI & Machine Learning

- SentenceTransformers
- BAAI/bge-base-en-v1.5
- RecursiveCharacterTextSplitter
- tiktoken
- Groq API

## Vector Database

- Qdrant

## Frontend *(Work in Progress)*

- Next.js
- React
- Tailwind CSS
- shadcn/ui

---

# 📂 Project Structure

```text
knowledgehub-ai/

├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── embeddings/
│   │   ├── models/
│   │   ├── prompts/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── vectorstore/
│   │
│   ├── uploads/
│   └── requirements.txt
│
└── frontend/
```

---

# 🔄 RAG Pipeline

1. Upload a PDF document
2. Extract text
3. Split text into chunks
4. Generate embeddings
5. Store vectors in Qdrant
6. Perform semantic search
7. Build retrieval context
8. Send prompt to Groq
9. Return grounded response with sources

---

# 📡 API Endpoints

## Documents

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/documents/upload` | Upload a document |
| GET | `/api/documents` | List uploaded documents |
| DELETE | `/api/documents/{id}` | Delete a document |

---

## Search

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/search` | Semantic document search |

---

## Chat

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/chat` | Chat with uploaded documents |

---

# ⚡ Local Setup

## Clone Repository

```bash
git clone https://github.com/<your-username>/knowledgehub-ai.git
cd knowledgehub-ai
```

---

## Backend

Create a virtual environment

```bash
python -m venv venv
```

Activate it

### Linux / macOS

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create a `.env`

```env
DATABASE_URL=
QDRANT_URL=
QDRANT_API_KEY=

GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile
```

Run the server

```bash
uvicorn app.main:app --reload
```

Open Swagger

```
http://127.0.0.1:8000/docs
```

---

# 📈 Current Status

## ✅ Completed

- PDF Upload
- Text Parsing
- Chunking
- Embedding Generation
- Qdrant Integration
- Semantic Search
- RAG Pipeline
- Groq Integration
- Source Referencing
- REST API

---

## 🚧 In Progress

- Next.js Frontend
- Beautiful Chat UI
- Drag & Drop Upload
- Conversation History
- Streaming Responses

---

# 🔮 Roadmap

- [x] Document Upload
- [x] Semantic Search
- [x] RAG Pipeline
- [x] Groq Integration
- [x] Source Citations
- [ ] Chat History
- [ ] Streaming Responses
- [ ] Multi-Conversation Support
- [ ] Hybrid Search (BM25 + Dense Retrieval)
- [ ] Response Streaming
- [ ] Docker Deployment
- [ ] Authentication
- [ ] Cloud Deployment

---

# 🤝 Contributing

Contributions, suggestions, and feature requests are welcome!

If you find a bug or have an idea for improvement, feel free to open an issue or submit a pull request.

---

# 📜 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!

It helps others discover the project and motivates future development.

---

Built using FastAPI, Qdrant, Groq, and modern AI technologies.
