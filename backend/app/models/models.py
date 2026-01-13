from sqlalchemy import Column, String, DateTime, Boolean, Text, JSON, Integer, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum
from app.core.database import Base


class ElectionStatus(str, enum.Enum):
    DRAFT = "draft"
    OPEN = "open"
    CLOSED = "closed"
    TALLIED = "tallied"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    elections = relationship("Election", back_populates="admin")


class Election(Base):
    __tablename__ = "elections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    public_key = Column(JSON, nullable=False)  # ElGamal public key
    status = Column(SQLEnum(ElectionStatus), default=ElectionStatus.DRAFT)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    questions = Column(JSON, nullable=False)  # Question structure
    settings = Column(JSON)  # mixnets, blind signatures, etc.
    voter_emails = Column(JSON)  # List of voter emails
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    admin = relationship("User", back_populates="elections")
    trustees = relationship("Trustee", back_populates="election")
    ballots = relationship("Ballot", back_populates="election")
    result = relationship("Result", back_populates="election", uselist=False)


class Trustee(Base):
    __tablename__ = "trustees"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    election_id = Column(UUID(as_uuid=True), ForeignKey("elections.id"), nullable=False)
    email = Column(String(255), nullable=False)
    public_key_share = Column(JSON)  # Partial public key
    verification_proof = Column(JSON)  # Proof of possession
    status = Column(String(20), default="pending")  # pending, active, completed
    created_at = Column(DateTime, default=datetime.utcnow)

    election = relationship("Election", back_populates="trustees")


class Ballot(Base):
    __tablename__ = "ballots"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    election_id = Column(UUID(as_uuid=True), ForeignKey("elections.id"), nullable=False)
    encrypted_ballot = Column(JSON, nullable=False)  # Encrypted choices
    proof = Column(JSON, nullable=False)  # ZKP of validity
    tracking_code = Column(String(64), unique=True, nullable=False, index=True)
    ipfs_hash = Column(String(64))  # CID when published
    timestamp = Column(DateTime, default=datetime.utcnow)
    voter_fingerprint = Column(String(64), index=True)  # Anonymous unique identifier
    voter_email = Column(String(255))  # Voter email for confirmation (optional)

    election = relationship("Election", back_populates="ballots")


class Result(Base):
    __tablename__ = "results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    election_id = Column(UUID(as_uuid=True), ForeignKey("elections.id"), unique=True, nullable=False)
    aggregated_encrypted = Column(JSON)  # Aggregated encrypted ballots
    decrypted_result = Column(JSON)  # Final plaintext results
    proofs = Column(JSON)  # Correctness proofs
    tally_log = Column(JSON)  # Audit trail
    finalized_at = Column(DateTime)

    election = relationship("Election", back_populates="result")


class MagicLink(Base):
    __tablename__ = "magic_links"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    election_id = Column(UUID(as_uuid=True), ForeignKey("elections.id"), nullable=False)
    email = Column(String(255), nullable=False)
    token = Column(String(255), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
