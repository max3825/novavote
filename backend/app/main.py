from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from app.core.config import settings
from app.api.v1 import auth, elections, ballots, magic_links
import logging

# Configure logging for production
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    default_response_class=ORJSONResponse
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_PREFIX}/auth", tags=["auth"])
app.include_router(elections.router, prefix=f"{settings.API_V1_PREFIX}/elections", tags=["elections"])
app.include_router(ballots.router, prefix=f"{settings.API_V1_PREFIX}/ballots", tags=["ballots"])
app.include_router(magic_links.router, prefix=f"{settings.API_V1_PREFIX}/magic-links", tags=["magic-links"])


@app.get("/")
def root():
    return {"message": "NovaVote API", "version": settings.VERSION}


@app.get("/health")
def health_check():
    return {"status": "ok"}
