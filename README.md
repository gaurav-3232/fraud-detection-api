# AutoGrader RAG

AI-powered auto-grading platform with RAG (Retrieval-Augmented Generation) for context-aware grading.

## Features

- Upload submissions → Auto-grade → View detailed feedback
- RAG-enhanced grading using reference documents
- Async processing with Celery workers
- Supports OpenAI or Ollama (local LLM)

## Quick Start

### 1. Start Services

```bash
cd infra
docker-compose up -d
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY (or configure Ollama)

pip install -r requirements.txt
```

### 3. Run the App

**Terminal 1 - API:**
```bash
cd backend
uvicorn app.main:app --reload
```

**Terminal 2 - Worker:**
```bash
cd backend
celery -A app.worker.celery_app worker -Q grading --loglevel=info --pool=solo
```

**Terminal 3 - Frontend:**
```bash
cd frontend
python -m http.server 8080
```

Open http://localhost:8080

## Usage

1. **Create Assignment** - Add title and rubric (JSON format)
2. **Add Reference** - Upload course materials for RAG
3. **Submit** - Upload student work (.txt, .pdf, .docx)
4. **View Grade** - Click "Explain" for detailed breakdown

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | FastAPI, Celery |
| Database | MySQL (raw SQL) |
| Storage | MinIO |
| Vector DB | Qdrant |
| Queue | Redis |
| LLM | OpenAI / Ollama |
| Frontend | HTML, Tailwind, Vanilla JS |

## Configuration

Edit `backend/.env`:

```env
# For OpenAI
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-4o-mini

# For Ollama (free, local)
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=llama3.2
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Worker crashes on macOS | Use `--pool=solo` flag |
| Task not found error | Restart Celery worker |
| OpenAI quota error | Add credits or switch to Ollama |
| Connection refused | Run `docker-compose up -d` |

## License

MIT
