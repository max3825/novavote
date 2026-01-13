"""Initial migration

Revision ID: 001
Revises: 
Create Date: 2026-01-09

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Users table
    op.create_table('users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('is_admin', sa.Boolean(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # Elections table
    op.create_table('elections',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('admin_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('public_key', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('status', sa.Enum('DRAFT', 'OPEN', 'CLOSED', 'TALLIED', name='electionstatus'), nullable=True),
        sa.Column('start_date', sa.DateTime(), nullable=True),
        sa.Column('end_date', sa.DateTime(), nullable=True),
        sa.Column('questions', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('settings', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['admin_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Trustees table
    op.create_table('trustees',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('election_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('public_key_share', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('verification_proof', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['election_id'], ['elections.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Ballots table
    op.create_table('ballots',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('election_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('encrypted_ballot', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('proof', postgresql.JSON(astext_type=sa.Text()), nullable=False),
        sa.Column('tracking_code', sa.String(length=64), nullable=False),
        sa.Column('ipfs_hash', sa.String(length=64), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=True),
        sa.Column('voter_fingerprint', sa.String(length=64), nullable=True),
        sa.ForeignKeyConstraint(['election_id'], ['elections.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_ballots_tracking_code'), 'ballots', ['tracking_code'], unique=True)
    op.create_index(op.f('ix_ballots_voter_fingerprint'), 'ballots', ['voter_fingerprint'], unique=False)

    # Results table
    op.create_table('results',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('election_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('aggregated_encrypted', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('decrypted_result', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('proofs', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('tally_log', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('finalized_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['election_id'], ['elections.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('election_id')
    )

    # Magic Links table
    op.create_table('magic_links',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('election_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('token', sa.String(length=255), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('used', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['election_id'], ['elections.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_magic_links_token'), 'magic_links', ['token'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_magic_links_token'), table_name='magic_links')
    op.drop_table('magic_links')
    op.drop_table('results')
    op.drop_index(op.f('ix_ballots_voter_fingerprint'), table_name='ballots')
    op.drop_index(op.f('ix_ballots_tracking_code'), table_name='ballots')
    op.drop_table('ballots')
    op.drop_table('trustees')
    op.drop_table('elections')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
