"""Add voter_email to ballots

Revision ID: add_voter_email_to_ballots
Revises: efaba1f5bec0
Create Date: 2026-01-15
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'add_voter_email_to_ballots'
down_revision = 'efaba1f5bec0'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('ballots', sa.Column('voter_email', sa.String(length=255), nullable=True))
    # Helpful index for duplicate-vote checks per election/email
    op.create_index('ix_ballots_election_id_voter_email', 'ballots', ['election_id', 'voter_email'], unique=False)


def downgrade() -> None:
    op.drop_index('ix_ballots_election_id_voter_email', table_name='ballots')
    op.drop_column('ballots', 'voter_email')
