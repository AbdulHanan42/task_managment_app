"""Add priority to tasks.

Revision ID: 8bcfe4b82f3a
Revises: 1d4da82f947f
Create Date: 2026-10-01
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "8bcfe4b82f3a"
down_revision: Union[str, Sequence[str], None] = "1d4da82f947f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "user_tasks",
        sa.Column("priority", sa.String(length=32), server_default="regular", nullable=False),
    )
    op.create_check_constraint(
        "ck_user_tasks_priority",
        "user_tasks",
        "priority IN ('most_important', 'important', 'normal', 'regular')",
    )


def downgrade() -> None:
    op.drop_constraint("ck_user_tasks_priority", "user_tasks", type_="check")
    op.drop_column("user_tasks", "priority")