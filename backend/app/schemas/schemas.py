from pydantic import BaseModel, EmailStr, UUID4
from datetime import datetime
from typing import Optional, List, Dict, Any
from app.models.models import ElectionStatus


# User schemas
class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserLogin(UserBase):
    password: str


class UserResponse(UserBase):
    id: UUID4
    is_admin: bool
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


# Election schemas
class QuestionCreate(BaseModel):
    question: str
    options: List[str]
    type: Optional[str] = "single"  # single, multiple, ranking (renommé de question_type -> type)

    def model_post_init(self, __context: Any) -> None:
        """Ajoute automatiquement l'option 'Vote blanc' pour single-choice"""
        if self.type == "single" and "Vote blanc" not in self.options:
            self.options.append("Vote blanc")


class ElectionBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    questions: List[QuestionCreate]


class ElectionCreate(ElectionBase):
    voter_emails: Optional[List[str]] = None


class ElectionResponse(ElectionBase):
    id: UUID4
    admin_id: UUID4
    public_key: Optional[Dict[str, Any]] = None
    status: ElectionStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Ballot schemas
class BallotSubmit(BaseModel):
    election_id: UUID4
    encrypted_ballot: Dict[str, Any]
    proof: Dict[str, Any]
    voter_fingerprint: str
    magic_token: Optional[str] = None  # Pour retrouver l'email du votant


class BallotResponse(BaseModel):
    id: UUID4
    tracking_code: str  # Garder le nom interne pour compatibilité
    timestamp: datetime
    ipfs_hash: Optional[str] = None

    class Config:
        from_attributes = True
    
    @property
    def receipt_code(self) -> str:
        """Alias pour accès utilisateur"""
        return self.tracking_code


# Magic Link schemas
class AccessLinkRequest(BaseModel):
    election_id: UUID4
    email: EmailStr


class AccessLinkResponse(BaseModel):
    message: str
    expires_in_minutes: int
