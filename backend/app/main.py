import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.app.config import settings
from backend.app.database import engine, Base, SessionLocal
from backend.app.seed_data import seed_database

# Routers
from backend.app.routers import (
    auth,
    ingest,
    entities,
    resolution,
    graph,
    insight,
    chat,
    export,
    feedback,
    seed
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("eventgraph.main")

# Initialize database schema
Base.metadata.create_all(bind=engine)

# Auto seed default tenant on startup
try:
    with SessionLocal() as db:
        seed_database(db, tenant_id=settings.DEFAULT_TENANT_ID)
except Exception as e:
    logger.error(f"Error seeding database on startup: {e}")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Business & Event Intelligence Graph Platform — Built for AI Riser Vietnam 2026 (#BuildwithGoogleAI)"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router)
app.include_router(ingest.router)
app.include_router(entities.router)
app.include_router(resolution.router)
app.include_router(graph.router)
app.include_router(insight.router)
app.include_router(chat.router)
app.include_router(export.router)
app.include_router(feedback.router)
app.include_router(seed.router)

# Serve Frontend static assets if built
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "dist")

if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Allow API routes to be handled by FastAPI
        if full_path.startswith("api") or full_path.startswith("docs") or full_path.startswith("openapi.json"):
            return None
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "app": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "status": "online",
            "docs": "/docs",
            "message": "EventGraph AI Backend API is running! Frontend is ready to be served upon build."
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
