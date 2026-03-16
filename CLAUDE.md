# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run

The entire stack runs via Docker Compose:

```bash
docker compose up -d --build    # Build and start all services
docker compose down              # Stop all services
docker compose logs -f backend   # Tail backend logs
```

Services: PostgreSQL (port 5432), FastAPI backend (port 8000), Nginx frontend (port 80).

### Frontend only (local dev)

```bash
cd frontend
npm install
npm run dev          # Vite dev server on :5173
npm run build        # Production build to dist/
```

### Backend only (local dev)

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Database migrations

```bash
cd backend
alembic upgrade head                              # Run all migrations
alembic revision -m "description"                 # Create new migration
```

Migrations run automatically on container startup via the docker-compose command.

## Architecture

**Job Application Tracker** — full-stack job application tracker with JWT auth.

- **Backend**: FastAPI + async SQLAlchemy + asyncpg + PostgreSQL. JWT auth via python-jose, passwords hashed with bcrypt.
- **Frontend**: React 18 + Vite + Tailwind CSS. No component library — all UI is hand-built with Tailwind utilities. Icons from lucide-react.
- **Deployment**: Multi-stage Docker build. Frontend served by Nginx which also reverse-proxies `/api/` to the backend.

### Backend structure (`backend/app/`)

- `main.py` — App init, CORS, lifespan (seeds demo user: `demo@demo.ca` / `password`)
- `database.py` — Async SQLAlchemy engine + session factory
- `auth.py` / `auth_routes.py` — JWT creation/verification, login/register endpoints
- `models.py` / `user_model.py` — SQLAlchemy models (JobApplication, User)
- `schemas.py` / `user_schemas.py` — Pydantic schemas
- `routes.py` — CRUD endpoints for applications (scoped to authenticated user)

### Frontend structure (`frontend/src/`)

- `App.jsx` — Root component, auth state, CRUD orchestration, toast notifications
- `api/` — Fetch wrappers that attach Bearer token from localStorage (`joblog_token`)
- `components/` — LoginPage, Header, StatsBar, StatusFilter, ApplicationTable, ApplicationModal, StatusBadge, DeleteDialog

### Data model

`JobApplication`: company, position, status (enum: applied/interview/offer/rejected), date_applied, notes. Scoped to user via `user_id` foreign key.

## Key conventions

- **No test suite or linter configured** — no pytest, jest, eslint, or prettier.
- **No .env files** — database URL and JWT secret are hardcoded defaults in code (dev-only setup).
- Tailwind custom colors defined in `frontend/tailwind.config.js`: primary (blue), accent (orange), and status-specific colors.
- Custom fonts: Plus Jakarta Sans (UI) and Caveat (handwritten accents).
- API base path: all backend routes under `/api/`, proxied by Nginx in production.
