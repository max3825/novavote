from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import hashlib
import uuid
from app.core.database import get_db
from app.models.models import Ballot, Election, ElectionStatus, MagicLink
from app.schemas.schemas import BallotSubmit, BallotResponse
from app.services.crypto_service import CryptoEngine
from app.services.storage_service import get_storage_adapter
from app.services.email_service import email_service

router = APIRouter()


@router.post("/", response_model=BallotResponse)
async def submit_ballot(ballot_data: BallotSubmit, db: AsyncSession = Depends(get_db)):
    """Submit encrypted ballot."""
    # Verify election exists and is open
    result = await db.execute(select(Election).where(Election.id == ballot_data.election_id))
    election = result.scalar_one_or_none()
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")
    
    if election.status != ElectionStatus.OPEN:
        raise HTTPException(status_code=400, detail="Election is not open for voting")
    
    # Verify ZKP
    if not CryptoEngine.verify_zkp(
        ballot_data.encrypted_ballot,
        ballot_data.proof,
        election.public_key
    ):
        raise HTTPException(status_code=400, detail="Invalid ballot proof")
    
    # Generate tracking code
    tracking_code = hashlib.sha256(
        f"{ballot_data.election_id}{ballot_data.voter_fingerprint}{uuid.uuid4()}".encode()
    ).hexdigest()[:16].upper()
    
    # Store in bulletin board (local or IPFS)
    storage = get_storage_adapter()
    bulletin_data = {
        "encrypted_ballot": ballot_data.encrypted_ballot,
        "proof": ballot_data.proof,
        "tracking_code": tracking_code
    }
    ipfs_hash = storage.store(bulletin_data)
    
    # Try to get voter email from magic link (optional)
    voter_email = None
    magic_link = None
    if hasattr(ballot_data, 'magic_token') and ballot_data.magic_token:
        ml_result = await db.execute(select(MagicLink).where(MagicLink.token == ballot_data.magic_token))
        magic_link = ml_result.scalar_one_or_none()
        if magic_link:
            # Check if this magic link has already voted
            existing_result = await db.execute(
                select(Ballot).where(
                    Ballot.election_id == ballot_data.election_id,
                    Ballot.voter_email == magic_link.email
                )
            )
            existing_ballot = existing_result.scalar_one_or_none()
            if existing_ballot:
                raise HTTPException(status_code=400, detail="You have already voted in this election")
            voter_email = magic_link.email
    
    # Save to database
    new_ballot = Ballot(
        election_id=ballot_data.election_id,
        encrypted_ballot=ballot_data.encrypted_ballot,
        proof=ballot_data.proof,
        tracking_code=tracking_code,
        ipfs_hash=ipfs_hash,
        voter_fingerprint=ballot_data.voter_fingerprint,
        voter_email=voter_email
    )
    
    db.add(new_ballot)
    await db.commit()
    await db.refresh(new_ballot)
    
    # Send confirmation email in background if we have voter email
    if voter_email:
        await email_service.send_vote_confirmation(
            voter_email,
            election.title,
            str(election.id),
            tracking_code
        )
    
    return new_ballot


@router.get("/verify/{tracking_code}")
async def verify_ballot(tracking_code: str, db: AsyncSession = Depends(get_db)):
    """Verify ballot exists in bulletin board."""
    result = await db.execute(select(Ballot).where(Ballot.tracking_code == tracking_code))
    ballot = result.scalar_one_or_none()
    if not ballot:
        raise HTTPException(status_code=404, detail="Ballot not found")
    
    return {
        "tracking_code": ballot.tracking_code,
        "timestamp": ballot.timestamp,
        "ipfs_hash": ballot.ipfs_hash,
        "verified": True
    }
