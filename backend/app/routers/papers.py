from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import crud

from app.schemas import (
    PaperListResponse,
    PaperDetailResponse,
)

from app.similarity.service import (
    find_similar_papers,
)

from app.reviewers.service import (
    find_reviewer_suggestions,
)


router = APIRouter(
    prefix="/papers",
    tags=["Papers"],
)


# ============================================================
# DATABASE DEPENDENCY
# ============================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


# ============================================================
# GET /papers
# ============================================================

@router.get(
    "",
    response_model=PaperListResponse,
    summary="Get research papers",
    description=(
        "Search, filter, sort and paginate research papers."
    ),
)
def get_papers(
    search: Optional[str] = None,
    year: Optional[int] = None,
    author: Optional[str] = None,
    topic: Optional[str] = None,
    sort: Optional[str] = None,
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db),
):
    return crud.get_papers(
        db=db,
        search=search,
        year=year,
        author=author,
        topic=topic,
        sort=sort,
        page=page,
        page_size=page_size,
    )


# ============================================================
# GET /papers/{paper_id}/similar
# ============================================================

@router.get(
    "/{paper_id}/similar",
    summary="Find similar papers",
    description=(
        "Returns the 5 most similar papers using "
        "semantic similarity and topic overlap."
    ),
)
def get_similar_papers(
    paper_id: int,
    db: Session = Depends(get_db),
):
    try:
        similar_papers = find_similar_papers(
            db=db,
            paper_id=paper_id,
            limit=5,
        )

        return {
            "paper_id": paper_id,
            "similar_papers": similar_papers,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )


# ============================================================
# GET /papers/{paper_id}/reviewers
# ============================================================

@router.get(
    "/{paper_id}/reviewers",
    summary="Suggest potential reviewers",
    description=(
        "Returns up to 3 potential reviewers from "
        "authors in the research corpus based on "
        "research overlap."
    ),
)
def get_reviewer_suggestions(
    paper_id: int,
    db: Session = Depends(get_db),
):
    try:
        reviewers = find_reviewer_suggestions(
            db=db,
            paper_id=paper_id,
            limit=3,
        )

        return {
            "paper_id": paper_id,
            "reviewers": reviewers,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )


# ============================================================
# GET /papers/{paper_id}
# ============================================================

@router.get(
    "/{paper_id}",
    response_model=PaperDetailResponse,
    summary="Get paper details",
    description=(
        "Returns a paper with authors and topics."
    ),
)
def get_paper(
    paper_id: int,
    db: Session = Depends(get_db),
):
    paper = crud.get_paper_by_id(
        db=db,
        paper_id=paper_id,
    )

    if paper is None:
        raise HTTPException(
            status_code=404,
            detail="Paper not found",
        )

    return paper