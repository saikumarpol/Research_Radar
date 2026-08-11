from typing import List

from sqlalchemy.orm import Session
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

from app.models import Paper


# ============================================================
# Configuration
# ============================================================

SEMANTIC_WEIGHT = 0.85
TOPIC_WEIGHT = 0.15

DEFAULT_LIMIT = 5

MODEL_NAME = "all-MiniLM-L6-v2"


# ============================================================
# Load embedding model once
# ============================================================

_model = None


def get_model():
    """
    Load the sentence-transformer model once.

    The model is kept in memory so we don't reload it
    for every API request.
    """

    global _model

    if _model is None:
        print(
            f"[SIMILARITY] Loading embedding model: {MODEL_NAME}"
        )

        _model = SentenceTransformer(
            MODEL_NAME
        )

        print(
            "[SIMILARITY] Embedding model loaded"
        )

    return _model


# ============================================================
# Build paper text
# ============================================================

def build_paper_text(paper: Paper) -> str:
    """
    Build the semantic representation of a paper.

    Title + abstract are the primary signals.

    Topics are included as additional context.
    """

    title = (
        paper.title or ""
    ).strip()

    abstract = (
        paper.abstract or ""
    ).strip()

    topics = " ".join(
        topic.name.strip()
        for topic in (paper.topics or [])
        if topic.name
        and topic.name.strip()
    )

    parts = []

    if title:
        parts.append(
            f"Title: {title}"
        )

    if abstract:
        parts.append(
            f"Abstract: {abstract}"
        )

    if topics:
        parts.append(
            f"Research topics: {topics}"
        )

    return "\n".join(parts)


# ============================================================
# Topic names
# ============================================================

def get_topic_names(
    paper: Paper,
) -> set[str]:

    return {
        topic.name.strip().lower()
        for topic in (paper.topics or [])
        if topic.name
        and topic.name.strip()
    }


# ============================================================
# Topic coverage
# ============================================================

def calculate_topic_similarity(
    target_topics: set[str],
    candidate_topics: set[str],
) -> float:
    """
    Measures how much of the target paper's topics
    are covered by the candidate.

    Example:

    Target:
        AI
        Ethics
        Governance

    Candidate:
        AI
        Ethics

    Result:

        2 / 3 = 0.667
    """

    if not target_topics:
        return 0.0

    matched_topics = (
        target_topics
        & candidate_topics
    )

    return (
        len(matched_topics)
        / len(target_topics)
    )


# ============================================================
# Find similar papers
# ============================================================

def find_similar_papers(
    db: Session,
    paper_id: int,
    limit: int = DEFAULT_LIMIT,
):
    """
    Find the most semantically similar papers.

    Ranking:

        85% semantic similarity
        15% topic coverage

    Semantic similarity is calculated from:

        - title
        - abstract
        - research topics

    The current paper and duplicate titles
    are excluded.
    """

    if limit <= 0:
        limit = DEFAULT_LIMIT

    # --------------------------------------------------------
    # Load papers
    # --------------------------------------------------------

    papers: List[Paper] = (
        db.query(Paper)
        .all()
    )

    if not papers:
        raise ValueError(
            "No papers found."
        )

    # --------------------------------------------------------
    # Find target paper
    # --------------------------------------------------------

    target_paper = next(
        (
            paper
            for paper in papers
            if paper.id == paper_id
        ),
        None,
    )

    if target_paper is None:
        raise ValueError(
            "Paper not found."
        )

    # --------------------------------------------------------
    # Build text
    # --------------------------------------------------------

    documents = [
        build_paper_text(paper)
        for paper in papers
    ]

    target_text = build_paper_text(
        target_paper
    )

    if not target_text.strip():
        raise ValueError(
            "Paper does not contain enough "
            "information for similarity search."
        )

    # --------------------------------------------------------
    # Load model
    # --------------------------------------------------------

    model = get_model()

    # --------------------------------------------------------
    # Generate embeddings
    # --------------------------------------------------------

    print(
        f"[SIMILARITY] Generating embeddings "
        f"for {len(documents)} papers"
    )

    embeddings = model.encode(
        documents,
        normalize_embeddings=True,
        show_progress_bar=False,
    )

    # --------------------------------------------------------
    # Target embedding
    # --------------------------------------------------------

    target_index = next(
        index
        for index, paper in enumerate(papers)
        if paper.id == paper_id
    )

    target_embedding = embeddings[
        target_index
    ]

    # --------------------------------------------------------
    # Semantic similarity
    # --------------------------------------------------------

    semantic_scores = cosine_similarity(
        [
            target_embedding
        ],
        embeddings,
    )[0]

    # --------------------------------------------------------
    # Target topics
    # --------------------------------------------------------

    target_topics = get_topic_names(
        target_paper
    )

    target_title = (
        target_paper.title or ""
    ).strip().lower()

    # --------------------------------------------------------
    # Candidates
    # --------------------------------------------------------

    candidates = []

    seen_titles = set()

    for index, paper in enumerate(papers):

        # ----------------------------------------------------
        # Skip current paper
        # ----------------------------------------------------

        if paper.id == paper_id:
            continue

        # ----------------------------------------------------
        # Skip empty title
        # ----------------------------------------------------

        if not paper.title:
            continue

        # ----------------------------------------------------
        # Normalize title
        # ----------------------------------------------------

        normalized_title = (
            paper.title
            .strip()
            .lower()
        )

        # ----------------------------------------------------
        # Skip duplicate target title
        # ----------------------------------------------------

        if normalized_title == target_title:
            continue

        # ----------------------------------------------------
        # Skip duplicate titles
        # ----------------------------------------------------

        if normalized_title in seen_titles:
            continue

        seen_titles.add(
            normalized_title
        )

        # ----------------------------------------------------
        # Semantic score
        # ----------------------------------------------------

        semantic_similarity = float(
            semantic_scores[index]
        )

        # ----------------------------------------------------
        # Topic score
        # ----------------------------------------------------

        candidate_topics = (
            get_topic_names(paper)
        )

        topic_similarity = (
            calculate_topic_similarity(
                target_topics,
                candidate_topics,
            )
        )

        # ----------------------------------------------------
        # Matched topics
        # ----------------------------------------------------

        matched_topics = sorted(
            target_topics
            & candidate_topics
        )

        # ----------------------------------------------------
        # Final score
        # ----------------------------------------------------

        final_score = (
            SEMANTIC_WEIGHT
            * semantic_similarity
        ) + (
            TOPIC_WEIGHT
            * topic_similarity
        )

        # ----------------------------------------------------
        # Add result
        # ----------------------------------------------------

        candidates.append(
            {
                "id": paper.id,

                "title": paper.title,

                "publication_year": (
                    paper.publication_year
                ),

                "cited_by_count": (
                    paper.cited_by_count
                    or 0
                ),

                "similarity_score": round(
                    final_score,
                    4,
                ),

                "semantic_similarity": round(
                    semantic_similarity,
                    4,
                ),

                "topic_similarity": round(
                    topic_similarity,
                    4,
                ),

                "matched_topics": [
                    topic.title()
                    for topic in matched_topics
                ],
            }
        )

    # --------------------------------------------------------
    # Rank
    # --------------------------------------------------------

    candidates.sort(
        key=lambda item: (
            item["similarity_score"],
            item["semantic_similarity"],
            item["topic_similarity"],
        ),
        reverse=True,
    )

    # --------------------------------------------------------
    # Return top N
    # --------------------------------------------------------

    results = candidates[:limit]

    print(
        f"[SIMILARITY] Returning "
        f"{len(results)} similar papers "
        f"for paper {paper_id}"
    )

    return results