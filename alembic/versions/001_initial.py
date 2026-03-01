"""initial tables
Revision ID: 001
"""
from alembic import op
import sqlalchemy as sa

revision = "001"
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table("predictions",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("request_id", sa.String(36), nullable=False),
        sa.Column("transcript_hash", sa.String(64), nullable=False),
        sa.Column("masked_transcript", sa.Text(), nullable=False),
        sa.Column("label", sa.String(10), nullable=False),
        sa.Column("risk_score", sa.Float(), nullable=False),
        sa.Column("reasons_json", sa.Text(), nullable=False),
        sa.Column("red_flags_json", sa.Text(), nullable=False),
        sa.Column("mode", sa.String(20), nullable=False),
        sa.Column("model_version", sa.String(50), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"))
    op.create_index("ix_predictions_request_id", "predictions", ["request_id"], unique=True)
    op.create_index("ix_predictions_transcript_hash", "predictions", ["transcript_hash"])
    op.create_table("feedback",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("transcript_hash", sa.String(64), nullable=False),
        sa.Column("predicted_label", sa.String(10), nullable=False),
        sa.Column("true_label", sa.String(10), nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"))
    op.create_index("ix_feedback_transcript_hash", "feedback", ["transcript_hash"])

def downgrade():
    op.drop_table("feedback")
    op.drop_table("predictions")
