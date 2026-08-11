Yes yaar. The goal should be:

> **Clone → create `.env` → `docker compose up` → migrate → ingest → open browser. Done in under 10 minutes.**

Keep the README simple and practical. No unnecessary architecture explanations.

Below is the **clean final `README.md`** I recommend for your repository.

````markdown
# Research Radar

Research Radar is a full-stack research paper discovery platform.

It uses OpenAlex for research papers, FastAPI for the backend, Next.js for the frontend, PostgreSQL for data storage, and OpenRouter for AI features.

The entire project runs with Docker.

---

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, shadcn/ui
- **Backend:** FastAPI, Python, SQLAlchemy
- **Database:** PostgreSQL 16
- **Migrations:** Alembic
- **Research Data:** OpenAlex API
- **AI:** OpenRouter, Sentence Transformers, Scikit-learn
- **Deployment:** Docker + Docker Compose

---

# Quick Start

You only need:

- Git
- Docker Desktop

You do **not** need to install Python, Node.js, npm, PostgreSQL, or FastAPI locally.

---

## 1. Clone the Repository

```bash
git clone https://github.com/saikumarpol/Research_Radar.git
cd Research_Radar
````

---

## 2. Create Environment File

Create:

```bash
touch backend/.env
```

Add the following:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/research_radar

OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY
OPENROUTER_MODEL=openrouter/free
```

Replace:

```text
YOUR_OPENROUTER_API_KEY
```

with your own OpenRouter API key.

> Never commit `backend/.env` to GitHub.

---

## 3. Start the Application

Run:

```bash
docker compose up -d --build
```

The first build may take a few minutes because the backend installs Python and AI dependencies.

Check the containers:

```bash
docker compose ps
```

You should see:

```text
research-radar
research-radar-db
```

The database should show as:

```text
healthy
```

---

## 4. Run Database Migrations

Run:

```bash
docker compose exec app sh -c "cd /app/backend && alembic upgrade head"
```

This creates the required database tables.

---

## 5. Load Research Papers

Research papers are fetched from OpenAlex.

Run:

```bash
docker compose exec app sh -c "cd /app/backend && python -m app.ingestion.ingest"
```

This imports the configured research papers into PostgreSQL.

This step can take some time depending on the number of papers configured for ingestion.

---

# Open the Application

After the containers are running:

### Frontend

```text
http://localhost:3001
```

### Backend API

```text
http://localhost:8001
```

### API Documentation

```text
http://localhost:8001/docs
```

---

# Verify the Database

Check the number of papers:

```bash
docker compose exec db psql -U postgres -d research_radar -c "SELECT COUNT(*) FROM papers;"
```

List all tables:

```bash
docker compose exec db psql -U postgres -d research_radar -c "\dt"
```

---

# Project Structure

```text
Research_Radar/
│
├── backend/
│   ├── alembic/
│   │   └── versions/
│   │
│   ├── app/
│   │   ├── ai/
│   │   ├── ingestion/
│   │   ├── reviewers/
│   │   ├── routers/
│   │   ├── similarity/
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── openalex.py
│   │   └── schemas.py
│   │
│   ├── alembic.ini
│   ├── requirements.txt
│   └── test_models.py
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── next.config.mjs
│
├── Dockerfile
├── docker-compose.yml
├── start.sh
├── .dockerignore
├── .gitignore
└── README.md
```

---

# Main Features

* Research paper discovery
* Paper search
* Topic filtering
* Year filtering
* Sorting
* Pagination
* Paper details
* Author information
* Research topics
* Similar papers
* AI paper summaries
* AI reviewer recommendations
* OpenAlex paper ingestion
* PostgreSQL storage
* Dockerized development environment

---

# Useful Commands

## Start

```bash
docker compose up -d
```

## Start and rebuild

```bash
docker compose up -d --build
```

## Stop

```bash
docker compose down
```

## Check containers

```bash
docker compose ps
```

## View application logs

```bash
docker compose logs app
```

## Follow application logs

```bash
docker compose logs -f app
```

## View database logs

```bash
docker compose logs db
```

## Restart application

```bash
docker compose restart app
```

## Restart database

```bash
docker compose restart db
```

---

# Database

PostgreSQL runs inside Docker.

The database connection used by the application is:

```text
postgresql://postgres:postgres@db:5432/research_radar
```

Important:

Inside Docker, use:

```text
db
```

as the PostgreSQL hostname.

Do **not** use:

```text
localhost
```

for the PostgreSQL hostname inside the backend container.

---

# Database Migrations

Apply migrations:

```bash
docker compose exec app sh -c "cd /app/backend && alembic upgrade head"
```

Migration files are located in:

```text
backend/alembic/versions/
```

---

# Research Paper Ingestion

The ingestion code is located at:

```text
backend/app/ingestion/ingest.py
```

Run ingestion:

```bash
docker compose exec app sh -c "cd /app/backend && python -m app.ingestion.ingest"
```

The ingestion process:

```text
OpenAlex API
     ↓
Fetch research papers
     ↓
Process paper data
     ↓
Store in PostgreSQL
     ↓
Frontend displays papers
```

---

# API

The backend is built with FastAPI.

API:

```text
http://localhost:8001
```

Swagger:

```text
http://localhost:8001/docs
```

Example papers request:

```bash
curl "http://localhost:8001/papers?page=1&page_size=9&sort=newest"
```

---

# Frontend

The frontend is built with Next.js.

Open:

```text
http://localhost:3001
```

The frontend communicates with the FastAPI backend through the Dockerized application.

---

# AI Features

AI functionality uses OpenRouter.

Environment variables:

```env
OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY
OPENROUTER_MODEL=openrouter/free
```

AI functionality includes:

* Paper summaries
* Similar paper analysis
* AI reviewer recommendations

You need your own OpenRouter API key to use these features.

---

# Environment Variables

Create:

```text
backend/.env
```

Example:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/research_radar
OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY
OPENROUTER_MODEL=openrouter/free
```

Never commit the real `.env` file.

For other developers, provide:

```text
backend/.env.example
```

with placeholder values only.

---

# Troubleshooting

## Docker is not running

If you see:

```text
Cannot connect to the Docker daemon
```

Start Docker Desktop and wait until it is ready.

Then run:

```bash
docker info
```

---

## Container is already running

If you see:

```text
Conflict. The container name "/research-radar" is already in use
```

Run:

```bash
docker compose down
```

Then:

```bash
docker compose up -d
```

---

## Database connection error

Check:

```bash
docker compose ps
```

Make sure:

```text
research-radar-db
```

is:

```text
healthy
```

Then check:

```bash
docker compose logs db
```

---

## Database tables are missing

Run:

```bash
docker compose exec app sh -c "cd /app/backend && alembic upgrade head"
```

---

## No papers are showing

Check the database:

```bash
docker compose exec db psql -U postgres -d research_radar -c "SELECT COUNT(*) FROM papers;"
```

If the count is `0`, run:

```bash
docker compose exec app sh -c "cd /app/backend && python -m app.ingestion.ingest"
```

---

## Port 3001 is already in use

Check:

```bash
lsof -i :3001
```

Stop the process using the port or change the Docker Compose port.

For example:

```yaml
ports:
  - "3002:3000"
```

Then open:

```text
http://localhost:3002
```

---

## Port 8001 is already in use

Check:

```bash
lsof -i :8001
```

You can change:

```yaml
ports:
  - "8002:8000"
```

Then the API will be available at:

```text
http://localhost:8002
```

---

# Reset the Database

⚠️ This deletes all PostgreSQL data.

Use only if you want a completely fresh database:

```bash
docker compose down -v
```

Then:

```bash
docker compose up -d --build
```

Run migrations:

```bash
docker compose exec app sh -c "cd /app/backend && alembic upgrade head"
```

Run ingestion:

```bash
docker compose exec app sh -c "cd /app/backend && python -m app.ingestion.ingest"
```

---

# Development Workflow

For normal development:

```bash
docker compose up -d
```

Check:

```bash
docker compose ps
```

After changing backend/database models:

```bash
docker compose exec app sh -c "cd /app/backend && alembic upgrade head"
```

After changing dependencies or Docker configuration:

```bash
docker compose up -d --build
```

View logs:

```bash
docker compose logs -f app
```

---

# Stop the Project

When finished:

```bash
docker compose down
```

This stops the containers but keeps the PostgreSQL data.

Start again later with:

```bash
docker compose up -d
```

---

# Fresh Setup Summary

For a developer setting up the project for the first time:

```bash
git clone https://github.com/saikumarpol/Research_Radar.git
cd Research_Radar

touch backend/.env
```

Add:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/research_radar
OPENROUTER_API_KEY=YOUR_OPENROUTER_API_KEY
OPENROUTER_MODEL=openrouter/free
```

Then:

```bash
docker compose up -d --build

docker compose exec app sh -c "cd /app/backend && alembic upgrade head"

docker compose exec app sh -c "cd /app/backend && python -m app.ingestion.ingest"
```

Open:

```text
http://localhost:3001
```

API:

```text
http://localhost:8001/docs
```

That's it.


