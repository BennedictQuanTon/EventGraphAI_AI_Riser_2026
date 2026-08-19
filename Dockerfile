# ==========================================
# STAGE 1: Build Frontend React SPA
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ==========================================
# STAGE 2: Python FastAPI Runtime & Cloud Run
# ==========================================
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r ./backend/requirements.txt

# Copy Backend code
COPY backend ./backend

# Copy built frontend assets
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Set environment variables for Cloud Run
ENV PORT=8000
ENV ENVIRONMENT=production
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Start unified FastAPI server (Serves both API and Frontend SPA)
CMD uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}
