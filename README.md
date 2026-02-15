# AI Portfolio

[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://royamit.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An intelligent, AI-powered portfolio website that showcases projects, skills, and experience through an interactive conversational interface. Built with Next.js 14 and FastAPI, featuring real-time AI chat powered by LangChain and OpenAI.

## 🎯 Overview

AI Portfolio is a full-stack application that transforms the traditional portfolio experience into an engaging conversation. The platform features:

- **AI-Powered Chatbot**: Intelligent assistant that answers questions about projects, skills, and experience using RAG (Retrieval-Augmented Generation)
- **Interactive Tour Guide**: Step-by-step guided tour optimized for both desktop and mobile devices
- **Real-time Streaming**: Server-Sent Events (SSE) for smooth, responsive chat interactions
- **Dynamic Content Display**: Project showcases, skills visualization, and resume integration
- **Smart Contact System**: Direct email integration with resume delivery functionality
- **Command Palette**: Quick navigation with keyboard shortcuts (`/projects`, `/skills`, `/resume`)

## 🏗️ Project Structure



```text
Portfolio/
├── frontend/                          # Next.js application
│   ├── app/                          # Next.js App Router
│   │   ├── globals.css              # Global styles and animations
│   │   ├── layout.tsx               # Root layout with providers
│   │   └── page.tsx                 # Main chat page
│   ├── components/                  # Reusable UI components
│   │   └── ui/                      # UI primitives (buttons, dialogs, etc.)
│   ├── features/                    # Feature-based modules
│   │   ├── chat/                    # Chat functionality
│   │   │   ├── components/          # Chat UI components
│   │   │   ├── context/             # Chat state management
│   │   │   ├── hooks/               # Chat-related hooks
│   │   │   └── lib/                 # Chat utilities (streaming, etc.)
│   │   ├── tour/                    # Interactive tour guide
│   │   ├── sidebar/                 # Navigation sidebar
│   │   ├── projects/                # Project showcase
│   │   ├── skills/                  # Skills visualization
│   │   ├── resume/                  # Resume display
│   │   ├── contact/                 # Contact form
│   │   └── command-palette/         # Keyboard shortcuts
│   ├── lib/                         # Utilities and helpers
│   │   ├── session.ts               # Session ID management for rate limiting
│   │   └── utils.ts                 # Helper functions
│   ├── services/                    # API client services
│   └── public/                      # Static assets (resume.pdf, images)
│
├── backend/                          # FastAPI application
│   ├── app/
│   │   ├── core/                    # Configuration and logging
│   │   │   ├── config.py            # Environment settings
│   │   │   ├── logging.py           # Logging configuration
│   │   │   ├── limiter.py           # Rate limiting configuration
│   │   │   └── exceptions.py        # Custom exception handlers
│   │   ├── routers/                 # API endpoints
│   │   │   ├── chat.py              # Streaming chat endpoint
│   │   │   └── contact.py           # Contact form endpoint
│   │   ├── services/                # Business logic
│   │   │   ├── agent_service.py     # LangChain AI agent
│   │   │   ├── rag_service.py       # Vector DB & retrieval
│   │   │   └── contact_service.py   # Email service
│   │   ├── models/                  # Data models
│   │   ├── data/                    # Knowledge base documents
│   │   │   ├── resume.txt
│   │   │   ├── projects.txt
│   │   │   ├── skills.txt
│   │   │   └── bio.txt
│   │   └── main.py                  # Application entry point
│   ├── requirements.txt             # Python dependencies
│   ├── Dockerfile                   # Docker configuration
│   └── .env.example                 # Environment template
│
└── docker-compose.yml                # Multi-service orchestration
```



## 🛠️ Technology Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **React 18** - UI library with TypeScript
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **Radix UI** - Accessible component primitives
- **React Query** - Data fetching and caching
- **React Markdown** - Markdown rendering
- **Embla Carousel** - Touch-friendly carousels
- **Lucide Icons** - Icon library

### Backend & AI

- **FastAPI** - High-performance Python web framework
- **LangChain** - AI agent orchestration and tooling
- **OpenAI GPT-4** - Language model for intelligent responses
- **PostgreSQL + pgvector** - Vector database for semantic search
- **Redis** - Chat history and session storage
- **Uvicorn** - ASGI server

### Infrastructure

- **Docker & Docker Compose** - Containerization
- **Server-Sent Events (SSE)** - Real-time streaming
- **FastAPI Mail** - Email service integration
- **Session-Based Rate Limiting** - API protection with SlowAPI (per-user tracking)

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+ and pip
- **Docker and Docker Compose** (for local database services)
- **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/api-keys)
- **SMTP Email Credentials** - For contact form (Gmail, SendGrid, etc.)

### Option 1: Quick Start with Docker (Recommended)

This option uses Docker to run PostgreSQL and Redis locally, making setup much easier.

#### 1. Clone and Install Dependencies

```bash
git clone https://github.com/royamit1/portfolio.git
cd Portfolio

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
pip install -r requirements.txt
```

#### 2. Environment Setup

Copy the environment template and configure it:

```bash
cp .env.example .env
```

(Optional) Configure frontend environment:

```bash
cp frontend/.env.example frontend/.env
```

Edit `.env` and fill in your API keys:

```bash
# Required: Get from https://platform.openai.com/api-keys
OPENAI_API_KEY="sk-..."

# Required: Your email for contact form
MAIL_USERNAME="your.email@gmail.com"
MAIL_PASSWORD="your_app_password"
OWNER_EMAIL="your.email@gmail.com"

# The database and Redis URLs are pre-configured for Docker
# No changes needed for DATABASE_URL and REDIS_URL if using Docker
```

#### 3. Customize Identity & Content

1.  **Backend Data:** Edit files in `backend/app/data/` (resume.txt, projects.txt, etc) to match your profile.
2.  **Configuration:** Edit `backend/app/core/config.py` to set `PORTFOLIO_OWNER` and `RESUME_LINK`.
3.  **PDF Resume:** Replace `frontend/public/resume.pdf` with your own file.
4.  **Images:** Replace `frontend/public/profile.jpg` with your photo.

```bash
# Edit these files with your information:
# - resume.txt    (Your professional summary, experience, education)
# - projects.txt  (Your projects with descriptions and tech stacks)
# - skills.txt    (Your technical skills and expertise)
# - bio.txt       (Your background and story)
```

#### 4. Start Database Services

```bash
# Go back to project root
cd ../..

# Start PostgreSQL and Redis in the background
docker-compose up -d postgres redis

# Check that services are running
docker-compose ps
```

#### 5. Start Backend Server

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

The backend will automatically ingest your portfolio data into the vector database on first startup.

#### 6. Start Frontend Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

The application will be available at http://localhost:3000.

#### 7. Stopping Services

When you're done developing:

```bash
# Stop the application (Ctrl+C in both terminals)
# Stop Docker services
docker-compose down

# To also remove volumes (delete all data):
# docker-compose down -v
```

### Option 2: External Services

If you prefer using external services, like in production (Neon, Upstash, etc.):

1. Set up your PostgreSQL database on [Neon](https://neon.tech) or [Supabase](https://supabase.com)
   - Enable the `pgvector` extension
2. Set up your Redis instance on [Upstash](https://upstash.com)
3. Copy `backend/.env.example` to `backend/.env`
4. Replace the `DATABASE_URL` and `REDIS_URL` with your external service URLs
5. Continue with steps 1-3 and 5-6 from Option 1 (skip step 4)

### Option 3: Production Deployment (Self-Hosted)

To run the optimized production build (frontend + backend + DBs) on a single server (VPS):

1.  Clone repo and setup environment (steps 1-2 from Option 1).
2.  Run with the production compose file:

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

This utilizes the multi-stage `frontend/Dockerfile` (target: `runner`) to build a standalone, optimized image (~100MB).

## 📝 Development Commands

**Note:** All `docker-compose` commands should be run from the **project root directory**.

| Command                          | Description                              |
| -------------------------------- | ---------------------------------------- |
| `docker-compose up`              | Start all services                       |
| `docker-compose up --build`      | Rebuild and start all services           |
| `docker-compose up -d`           | Start services in background (detached)  |
| `docker-compose down`            | Stop all services                        |
| `docker-compose down -v`         | Stop and remove volumes (delete data)    |
| `docker-compose logs -f`         | View logs from all services              |
| `docker-compose logs -f backend` | View backend logs only                   |
| `docker-compose ps`              | Check service status                     |
| `docker-compose restart backend` | Restart backend service only             |

## 🤖 How It Works

### AI Agent Architecture

The backend uses LangChain to create an intelligent AI agent with two primary tools:

1. **Portfolio Knowledge Base**: Vector search using RAG to retrieve relevant information from your portfolio documents
2. **Resume Email Tool**: Sends PDF resume via email to interested parties

### Data Flow

```
User Message → Frontend → FastAPI Backend → LangChain Agent
                             ↓
                    [Tool Selection]
                             ↓
        ┌────────────────────┴────────────────────┐
        ↓                                         ↓
Portfolio Knowledge Base              Resume Email Tool
(Vector Search in PostgreSQL)         (SMTP Email Service)
        ↓                                         ↓
    Retrieved Context                      Email Sent
        ↓                                         ↓
        └────────────────→ GPT-4 Response ←──────┘
                             ↓
                    Stream to Frontend (SSE)
                             ↓
                      Live Chat Display
```

### Knowledge Base Ingestion

On startup, the backend automatically:
1. Reads documents from `backend/app/data/`
2. Splits text into semantic chunks
3. Generates embeddings using OpenAI
4. Stores in PostgreSQL with pgvector extension
5. Enables semantic search for relevant information retrieval


## 🚀 Deployment

The application is designed to be deployed with:
- **Frontend** on [Vercel](https://vercel.com)
- **Backend** on [Render](https://render.com)

Both support automatic deployment on every push to the main branch.

**Note:** For production, use external database services like [Neon](https://neon.tech) for PostgreSQL and [Upstash](https://upstash.com) for Redis.


## 🧪 Testing

### Run Backend Tests

```bash
cd backend
python -m pytest

# With coverage
pytest --cov=app tests/
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [FastAPI Documentation](https://fastapi.tiangolo.com) - FastAPI framework
- [LangChain Documentation](https://python.langchain.com) - AI agent framework
- [OpenAI API Reference](https://platform.openai.com/docs) - GPT models
- [PostgreSQL + pgvector](https://github.com/pgvector/pgvector) - Vector similarity search
- [Docker Compose](https://docs.docker.com/compose/) - Multi-container applications
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Roy Amit**

- Portfolio: [royamit.vercel.app](https://royamit.vercel.app)
- GitHub: [@royamit1](https://github.com/royamit1)
- LinkedIn: [Roy Amit](https://linkedin.com/in/roy-amit)

---

<div align="center">
  <p>⭐ Star this repo if you found it helpful!</p>
</div>