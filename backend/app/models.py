from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    Table,
    JSON,
    DateTime,
    Index,
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


# ============================================================
# Association Tables
# ============================================================

paper_authors = Table(
    "paper_authors",
    Base.metadata,

    Column(
        "paper_id",
        Integer,
        ForeignKey("papers.id"),
        primary_key=True,
    ),

    Column(
        "author_id",
        Integer,
        ForeignKey("authors.id"),
        primary_key=True,
    ),
)


paper_topics = Table(
    "paper_topics",
    Base.metadata,

    Column(
        "paper_id",
        Integer,
        ForeignKey("papers.id"),
        primary_key=True,
    ),

    Column(
        "topic_id",
        Integer,
        ForeignKey("topics.id"),
        primary_key=True,
    ),
)


# ============================================================
# Paper
# ============================================================

class Paper(Base):

    __tablename__ = "papers"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    openalex_id = Column(
        String,
        unique=True,
        nullable=False,
        index=True,
    )

    title = Column(
        String,
        nullable=False,
        index=True,
    )

    abstract = Column(Text)

    publication_year = Column(
        Integer,
        index=True,
    )

    publication_date = Column(String)

    doi = Column(
        String,
        index=True,
    )

    cited_by_count = Column(
        Integer,
        default=0,
    )

    authors = relationship(
        "Author",
        secondary=paper_authors,
        back_populates="papers",
    )

    topics = relationship(
        "Topic",
        secondary=paper_topics,
        back_populates="papers",
    )

    ai_insight = relationship(
        "PaperAIInsight",
        back_populates="paper",
        uselist=False,
        cascade="all, delete-orphan",
    )


# ============================================================
# Author
# ============================================================

class Author(Base):

    __tablename__ = "authors"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    openalex_id = Column(
        String,
        unique=True,
        index=True,
    )

    name = Column(
        String,
        nullable=False,
        index=True,
    )

    papers = relationship(
        "Paper",
        secondary=paper_authors,
        back_populates="authors",
    )


# ============================================================
# Topic
# ============================================================

class Topic(Base):

    __tablename__ = "topics"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String,
        unique=True,
        nullable=False,
        index=True,
    )

    papers = relationship(
        "Paper",
        secondary=paper_topics,
        back_populates="topics",
    )


# ============================================================
# AI Insight
# ============================================================

class PaperAIInsight(Base):

    __tablename__ = "paper_ai_insights"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    paper_id = Column(
        Integer,
        ForeignKey("papers.id"),
        unique=True,
        nullable=False,
    )

    insights_json = Column(
        JSON,
        nullable=False,
    )

    model = Column(
        String,
        nullable=False,
        default="openrouter/free",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    paper = relationship(
        "Paper",
        back_populates="ai_insight",
    )