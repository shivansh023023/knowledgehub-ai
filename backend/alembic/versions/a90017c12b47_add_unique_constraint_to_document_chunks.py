"""add unique constraint to document chunks

Revision ID: a90017c12b47
Revises: 21e12b27de88
Create Date: 2026-07-19 19:39:21.294055

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "a90017c12b47"
down_revision: Union[str, Sequence[str], None] = "21e12b27de88"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    with op.batch_alter_table("document_chunks") as batch_op:
        batch_op.create_unique_constraint(
            "uq_document_chunk_index",
            ["document_id", "chunk_index"],
        )


def downgrade() -> None:
    """Downgrade schema."""

    with op.batch_alter_table("document_chunks") as batch_op:
        batch_op.drop_constraint(
            "uq_document_chunk_index",
            type_="unique",
        )