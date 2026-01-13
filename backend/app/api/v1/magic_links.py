from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
import secrets
import logging
from app.core.database import get_db
from app.core.config import get_settings
from app.models.models import Election, MagicLink
from app.schemas.schemas import MagicLinkRequest, MagicLinkResponse
from app.services.email_service import email_service

router = APIRouter()
settings = get_settings()
logger = logging.getLogger(__name__)


@router.post("/generate", response_model=MagicLinkResponse)
async def generate_magic_link(
    request: MagicLinkRequest,
    db: AsyncSession = Depends(get_db)
):
    """Generate and send magic link for voter authentication."""
    # Verify election exists and is open
    result = await db.execute(select(Election).where(Election.id == request.election_id))
    election = result.scalar_one_or_none()
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")
    
    if election.status != "open":
        raise HTTPException(status_code=400, detail="Election is not open for voting")
    
    # Generate secure token
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(minutes=settings.MAGIC_LINK_EXPIRE_MINUTES)
    
    # Create magic link record
    magic_link = MagicLink(
        election_id=request.election_id,
        email=request.email,
        token=token,
        expires_at=expires_at
    )
    
    db.add(magic_link)
    await db.commit()
    
    # Send email
    try:
        await email_service.send_magic_link(
            email=request.email,
            token=token,
            election_title=election.title
        )
    except Exception as e:
        # Log error but don't fail - user can still use token if they have it
        logger.error("Failed to send email: %s", str(e))
    
    return MagicLinkResponse(
        message="Magic link sent successfully",
        expires_in_minutes=settings.MAGIC_LINK_EXPIRE_MINUTES
    )


@router.get("/verify/{token}")
async def verify_magic_link(token: str, db: AsyncSession = Depends(get_db)):
    """Verify magic link token and return election details."""
    result = await db.execute(
        select(MagicLink).where(
            MagicLink.token == token,
            MagicLink.used == False,
            MagicLink.expires_at > datetime.utcnow()
        )
    )
    magic_link = result.scalar_one_or_none()
    
    if not magic_link:
        raise HTTPException(status_code=400, detail="Invalid or expired magic link")
    
    # Get election
    election_result = await db.execute(select(Election).where(Election.id == magic_link.election_id))
    election = election_result.scalar_one_or_none()
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")
    
    if election.status != "open":
        raise HTTPException(status_code=400, detail="Election is not open for voting")
    
    return {
        "election_id": str(election.id),
        "election_title": election.title,
        "email": magic_link.email,
        "questions": election.questions,
        "public_key": election.public_key
    }


@router.post("/use/{token}")
async def use_magic_link(token: str, db: AsyncSession = Depends(get_db)):
    """Mark magic link as used after successful ballot submission."""
    result = await db.execute(
        select(MagicLink).where(
            MagicLink.token == token,
            MagicLink.used == False
        )
    )
    magic_link = result.scalar_one_or_none()
    
    if not magic_link:
        raise HTTPException(status_code=400, detail="Invalid magic link")
    
    magic_link.used = True
    await db.commit()
    
    return {"message": "Magic link marked as used"}
