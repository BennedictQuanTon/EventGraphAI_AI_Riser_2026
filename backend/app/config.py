import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "EventGraph AI"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Google AI Studio / Gemini API
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    GEMINI_EMBEDDING_MODEL: str = os.getenv("GEMINI_EMBEDDING_MODEL", "text-embedding-004")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./eventgraph.db")
    
    # Google Maps (Optional for map embeds)
    GOOGLE_MAPS_API_KEY: str = os.getenv("GOOGLE_MAPS_API_KEY", "")
    
    # Firebase / Multi-tenant (Optional)
    FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID", "")
    DEFAULT_TENANT_ID: str = os.getenv("DEFAULT_TENANT_ID", "tenant-demo-hub")
    
    # CORS
    CORS_ORIGINS: list[str] = ["*"]
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
