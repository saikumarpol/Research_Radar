# ============================================================
# Stage 1: Build Next.js frontend
# ============================================================

FROM node:22-bookworm-slim AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ ./

ENV NEXT_PUBLIC_API_URL=/api

RUN npm run build


# ============================================================
# Stage 2: Run frontend + backend
# ============================================================

FROM node:22-bookworm-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/opt/venv/bin:$PATH"

# ============================================================
# Install system dependencies
# ============================================================

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        python3 \
        python3-venv \
        python3-pip \
        libpq5 \
        curl \
        ca-certificates && \
    rm -rf /var/lib/apt/lists/*


# ============================================================
# Python virtual environment
# ============================================================

RUN python3 -m venv /opt/venv

RUN pip install --no-cache-dir --upgrade \
    pip \
    setuptools \
    wheel


# ============================================================
# Backend dependencies
# ============================================================

COPY backend/requirements.txt /app/backend/requirements.txt

RUN pip install --no-cache-dir \
    -r /app/backend/requirements.txt


# ============================================================
# Backend source
# ============================================================

COPY backend /app/backend


# ============================================================
# Frontend production build
# ============================================================

COPY --from=frontend-builder /app/frontend /app/frontend


# ============================================================
# Runtime
# ============================================================

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000
EXPOSE 8000


# ============================================================
# Start FastAPI + Next.js
# ============================================================

CMD ["sh", "-c", "cd /app/backend && uvicorn app.main:app --host 0.0.0.0 --port 8000 & exec npm start --prefix /app/frontend"]