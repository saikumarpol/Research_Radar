from typing import Optional

from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.models import (
    Paper,
    Author,
    Topic,
)


# ============================================================
# GET PAPERS
# ============================================================

def get_papers(
    db: Session,
    search: Optional[str] = None,
    year: Optional[int] = None,
    author: Optional[str] = None,
    topic: Optional[str] = None,
    sort: Optional[str] = None,
    page: int = 1,
    page_size: int = 10,
):
    """
    Get paginated research papers with:

    - title + abstract search
    - year filter
    - author filter
    - topic filter
    - sorting
    - pagination
    """

    # --------------------------------------------------------
    # Pagination safety
    # --------------------------------------------------------

    page = max(page, 1)

    page_size = max(page_size, 1)
    page_size = min(page_size, 100)

    # --------------------------------------------------------
    # Base query
    # --------------------------------------------------------

    query = (
        db.query(Paper)
        .options(
            joinedload(Paper.authors),
            joinedload(Paper.topics),
        )
    )

    # ========================================================
    # SEARCH
    # ========================================================

    if search and search.strip():

        search_text = f"%{search.strip()}%"

        query = query.filter(
            or_(
                Paper.title.ilike(search_text),
                Paper.abstract.ilike(search_text),
            )
        )

    # ========================================================
    # YEAR
    # ========================================================

    if year is not None:

        query = query.filter(
            Paper.publication_year == year
        )

    # ========================================================
    # AUTHOR
    # ========================================================

    if author and author.strip():

        author_text = f"%{author.strip()}%"

        query = query.filter(
            Paper.authors.any(
                Author.name.ilike(author_text)
            )
        )

    # ========================================================
    # TOPIC
    # ========================================================

    if topic and topic.strip():

        topic_text = f"%{topic.strip()}%"

        query = query.filter(
            Paper.topics.any(
                Topic.name.ilike(topic_text)
            )
        )

    # ========================================================
    # SORT
    # ========================================================

    if sort == "oldest":

        query = query.order_by(
            Paper.publication_date.asc().nullslast(),
            Paper.id.asc(),
        )

    elif sort == "citations":

        query = query.order_by(
            Paper.cited_by_count.desc(),
            Paper.id.desc(),
        )

    elif sort == "title":

        query = query.order_by(
            Paper.title.asc(),
            Paper.id.asc(),
        )

    else:

        # Default = newest
        query = query.order_by(
            Paper.publication_date.desc().nullslast(),
            Paper.id.desc(),
        )

    # ========================================================
    # DISTINCT
    # ========================================================

    query = query.distinct()

    # ========================================================
    # TOTAL
    # ========================================================

    total = query.count()

    # ========================================================
    # PAGINATION
    # ========================================================

    offset = (page - 1) * page_size

    papers = (
        query
        .offset(offset)
        .limit(page_size)
        .all()
    )

    # ========================================================
    # TOTAL PAGES
    # ========================================================

    total_pages = (
        (total + page_size - 1) // page_size
        if total > 0
        else 0
    )

    return {
        "items": papers,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


# ============================================================
# GET PAPER BY ID
# ============================================================

def get_paper_by_id(
    db: Session,
    paper_id: int,
):
    """
    Get one complete paper.

    Authors and topics are eagerly loaded.
    """

    return (
        db.query(Paper)
        .options(
            joinedload(Paper.authors),
            joinedload(Paper.topics),
        )
        .filter(
            Paper.id == paper_id
        )
        .first()
    )