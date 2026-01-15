from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List
from datetime import datetime, timedelta
import uuid
import base64
import json
import logging
from app.core.database import get_db
from app.models.models import Election, User, ElectionStatus, MagicLink, Ballot, Result
from app.schemas.schemas import ElectionCreate, ElectionResponse
from app.services.crypto_service import CryptoEngine
from app.services.email_service import email_service
from app.api.v1.dependencies import get_current_admin_user
import secrets
from app.core.config import get_settings

settings = get_settings()

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/", response_model=ElectionResponse)
async def create_election(
    election_data: ElectionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create new election (admin only)."""
    # Generate election keypair
    keypair = CryptoEngine.generate_keypair()
    
    # Default start_date to now if not provided
    start_date = election_data.start_date or datetime.utcnow()

    new_election = Election(
        title=election_data.title,
        description=election_data.description,
        admin_id=current_user.id,
        public_key=keypair["public_key"],
        questions=[q.model_dump() for q in election_data.questions],
        start_date=start_date,
        end_date=election_data.end_date,
        voter_emails=election_data.voter_emails or [],
        status=ElectionStatus.DRAFT
    )
    
    db.add(new_election)
    await db.commit()
    await db.refresh(new_election)
    return new_election


@router.get("/", response_model=List[ElectionResponse])
async def list_elections(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """List all elections for current admin."""
    result = await db.execute(select(Election).where(Election.admin_id == current_user.id))
    elections = result.scalars().all()
    return elections


@router.patch("/{election_id}/status")
async def update_election_status(
    election_id: str,
    new_status: ElectionStatus,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Change election status (draft -> open -> closed -> tallied)."""
    result = await db.execute(
        select(Election).where(
            Election.id == uuid.UUID(election_id),
            Election.admin_id == current_user.id
        )
    )
    election = result.scalar_one_or_none()
    
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")
    
    # Si on passe de draft à open, envoyer les emails
    if election.status == ElectionStatus.DRAFT and new_status == ElectionStatus.OPEN:
        if election.voter_emails:
            async def send_invitations():
                for email in election.voter_emails:
                    if email and email.strip():
                        try:
                            # Générer token et magic link
                            token = secrets.token_urlsafe(32)
                            expires_at = datetime.utcnow() + timedelta(minutes=settings.MAGIC_LINK_EXPIRE_MINUTES)
                            
                            magic_link = MagicLink(
                                election_id=election.id,
                                email=email.strip(),
                                token=token,
                                expires_at=expires_at
                            )
                            db.add(magic_link)
                            await db.commit()
                            
                            await email_service.send_magic_link(
                                email=email.strip(),
                                token=token,
                                election_title=election.title
                            )
                            logger.info("[EMAIL SENT] Magic link sent to %s", email.strip())
                        except Exception as e:
                            logger.error("[EMAIL ERROR] Failed to send to %s: %s", email, str(e))
            
            # Exécuter l'envoi des emails
            await send_invitations()
    
    election.status = new_status
    election.updated_at = datetime.utcnow()
    await db.commit()
    
    return {"message": f"Election status updated to {new_status}"}


@router.get("/{election_id}/stats")
async def get_election_stats(
    election_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get election statistics with detailed results."""
    result = await db.execute(select(Election).where(Election.id == uuid.UUID(election_id)))
    election = result.scalar_one_or_none()
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")
    
    ballots_result = await db.execute(select(Ballot).where(Ballot.election_id == uuid.UUID(election_id)))
    ballots = ballots_result.scalars().all()
    vote_count = len(ballots)
    
    invited_count = len(election.voter_emails) if election.voter_emails else 0
    
    results_by_question = []
    for q_idx, question in enumerate(election.questions):
        question_title = question.get('question', f'Question {q_idx + 1}')
        question_type = question.get('type', 'single')  # CORRIGÉ: type au lieu de question_type
        options = question.get('options', [])
        option_counts = {opt: 0 for opt in options}
        
        for ballot in ballots:
            try:
                choices = ballot.encrypted_ballot.get('choices', [])
                if q_idx < len(choices):
                    choice_data = choices[q_idx]
                    if 'encrypted' in choice_data:
                        encrypted_value = choice_data['encrypted']
                        try:
                            decoded = base64.b64decode(encrypted_value).decode('iso-8859-1')
                            
                            # ========================================
                            # LOGIQUE DE COMPTAGE PAR TYPE
                            # ========================================
                            try:
                                decoded_list = json.loads(decoded)
                                
                                # TYPE: CHOIX MULTIPLE → Compter toutes les options sélectionnées
                                if question_type == 'multiple' and isinstance(decoded_list, list):
                                    for selected_option in decoded_list:
                                        if selected_option in options:
                                            option_counts[selected_option] += 1
                                        else:
                                            logger.warning("Multiple vote option not found: %s", selected_option)
                                
                                # TYPE: CLASSEMENT (RANKING) → Compter UNIQUEMENT le 1er choix
                                # Format: {"1": "Option A", "2": "Option B", "3": "Option C"}
                                # Seul le choix en position "1" compte (scrutin majoritaire à 1 tour)
                                elif question_type == 'ranking' and isinstance(decoded_list, dict):
                                    first_choice = decoded_list.get("1")
                                    if first_choice and first_choice in options:
                                        option_counts[first_choice] += 1
                                    elif first_choice:
                                        logger.warning("Ranking first choice not found: %s", first_choice)
                                
                                # Autre type JSON → Warning
                                else:
                                    logger.warning("Unexpected vote format for type %s: %s", question_type, type(decoded_list))
                                    
                            except (json.JSONDecodeError, ValueError):
                                # Pas du JSON → Vote Simple (single choice)
                                if decoded in options:
                                    option_counts[decoded] += 1
                                else:
                                    logger.warning("Vote value not found in options: %s", decoded)
                                    
                        except Exception as decode_err:
                            logger.error("Failed to decode vote: %s", decode_err)
            except Exception as e:
                logger.exception("Error parsing ballot: %s", e)
                continue
        
        results_by_question.append({
            "question": question_title,
            "type": question_type,
            "options": [
                {
                    "option": opt,
                    "votes": option_counts[opt],
                    "percentage": (option_counts[opt] / vote_count * 100) if vote_count > 0 else 0
                }
                for opt in options
            ]
        })
    
    return {
        "election_id": election_id,
        "votes_received": vote_count,
        "voters_invited": invited_count,
        "participation_rate": (vote_count / invited_count * 100) if invited_count > 0 else 0,
        "results_by_question": results_by_question
    }


@router.get("/{election_id}", response_model=ElectionResponse)
async def get_election(election_id: str, db: AsyncSession = Depends(get_db)):
    """Get election details."""
    result = await db.execute(select(Election).where(Election.id == uuid.UUID(election_id)))
    election = result.scalar_one_or_none()
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")
    return election


@router.delete("/{election_id}")
async def delete_election(
    election_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete an election (admin only)."""
    result = await db.execute(
        select(Election).where(
            Election.id == uuid.UUID(election_id),
            Election.admin_id == current_user.id
        )
    )
    election = result.scalar_one_or_none()
    
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")
    
    await db.execute(delete(MagicLink).where(MagicLink.election_id == election.id))
    await db.execute(delete(Ballot).where(Ballot.election_id == election.id))
    await db.execute(delete(Result).where(Result.election_id == election.id))
    await db.delete(election)
    await db.commit()
    
    return {"message": "Election deleted successfully"}
