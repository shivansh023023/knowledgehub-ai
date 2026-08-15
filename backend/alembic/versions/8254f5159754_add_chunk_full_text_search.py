"""add chunk full text search

Revision ID: 8254f5159754
Revises: a90017c12b47
Create Date: 2026-08-15 21:03:34.720197

"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "8254f5159754"
down_revision: Union[str, Sequence[str], None] = "a90017c12b47"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
        CREATE VIRTUAL TABLE IF NOT EXISTS document_chunks_fts
        USING fts5(
            content,
            content='document_chunks',
            content_rowid='rowid'
        )
        """
    )

    op.execute(
        """
        INSERT INTO document_chunks_fts(rowid, content)
        SELECT rowid, content
        FROM document_chunks
        """
    )


def downgrade() -> None:
    op.execute(
        """
        DROP TABLE IF EXISTS document_chunks_fts
        """
    )