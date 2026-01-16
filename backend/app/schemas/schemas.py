from pydantic import BaseModel, EmailStr, UUID4, field_validator
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

    @field_validator("end_date")
    @classmethod
    def validate_end_date(cls, v: Optional[datetime], info) -> Optional[datetime]:
        """Valide que end_date > start_date et que les dates ne sont pas dans le passé"""
        if v is None:
            return v
        
        # Vérifier que end_date n'est pas dans le passé
        now = datetime.now()
        if v < now:
            raise ValueError("La date de fin ne peut pas être dans le passé")
        
        # Vérifier que end_date > start_date
        start_date = info.data.get("start_date")
        if start_date and v <= start_date:
            raise ValueError("La date de fin doit être après la date de début")
        
        return v

    @field_validator("start_date")
    @classmethod
    def validate_start_date(cls, v: Optional[datetime]) -> Optional[datetime]:
        """Valide que start_date n'est pas dans le passé"""
        if v is None:
            return v
        
        now = datetime.now()
        if v < now:
            raise ValueError("La date de début ne peut pas être dans le passé")
        
        return v


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
