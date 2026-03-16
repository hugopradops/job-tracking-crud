"""add users table and user_id to job_applications

Revision ID: 002
Revises: 001
Create Date: 2026-03-16

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "002"
down_revision: Union[str, None] = "001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )

    # Add user_id column to job_applications (nullable first for existing rows)
    op.add_column(
        "job_applications",
        sa.Column("user_id", sa.Integer(), nullable=True),
    )

    # Delete any existing rows since they have no associated user
    op.execute("DELETE FROM job_applications WHERE user_id IS NULL")

    # Now make the column NOT NULL
    op.alter_column("job_applications", "user_id", nullable=False)

    # Add foreign key constraint
    op.create_foreign_key(
        "fk_job_applications_user_id",
        "job_applications",
        "users",
        ["user_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint("fk_job_applications_user_id", "job_applications", type_="foreignkey")
    op.drop_column("job_applications", "user_id")
    op.drop_table("users")
