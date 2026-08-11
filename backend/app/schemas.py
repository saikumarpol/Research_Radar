from typing import List, Optional

from pydantic import BaseModel, ConfigDict


# ============================================================
# AUTHOR RESPONSE
# ============================================================

class AuthorResponse(BaseModel):

    id: int
    name: str

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# TOPIC RESPONSE
# ============================================================

class TopicResponse(BaseModel):

    id: int
    name: str

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# PAPER RESPONSE
# ============================================================

class PaperResponse(BaseModel):

    id: int

    openalex_id: Optional[str] = None

    title: str

    abstract: Optional[str] = None

    publication_year: Optional[int] = None

    publication_date: Optional[str] = None

    doi: Optional[str] = None

    cited_by_count: int = 0

    authors: List[AuthorResponse] = []

    topics: List[TopicResponse] = []

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# PAPER LIST RESPONSE
# ============================================================

class PaperListResponse(BaseModel):

    items: List[PaperResponse]

    total: int

    page: int

    page_size: int

    total_pages: int

    model_config = ConfigDict(
        from_attributes=True
    )


# ============================================================
# PAPER DETAIL RESPONSE
# ============================================================

class PaperDetailResponse(BaseModel):

    id: int

    openalex_id: Optional[str] = None

    title: str

    abstract: Optional[str] = None

    publication_year: Optional[int] = None

    publication_date: Optional[str] = None

    doi: Optional[str] = None

    cited_by_count: int = 0

    authors: List[AuthorResponse] = []

    topics: List[TopicResponse] = []

    model_config = ConfigDict(
        from_attributes=True
    )