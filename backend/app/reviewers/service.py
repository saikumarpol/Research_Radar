from sqlalchemy.orm import Session

from app.models import Paper, Author


# ============================================================
# Configuration
# ============================================================

DEFAULT_LIMIT = 3

# Maximum number of relevant papers that contribute
# to the score.
MAX_RELEVANT_PAPERS = 5


# ============================================================
# Reviewer Suggestions
# ============================================================

def find_reviewer_suggestions(
    db: Session,
    paper_id: int,
    limit: int = DEFAULT_LIMIT,
):
    """
    Suggest potential reviewers from authors already
    present in the research corpus.

    Ranking is based on:

    1. Number of distinct overlapping research topics
    2. Number of relevant papers published by the author
    3. Semantic/textual relevance of those papers

    Authors of the target paper are excluded.

    Only authors with at least one paper sharing a topic
    with the target paper are considered.
    """

    # ========================================================
    # Validate limit
    # ========================================================

    if limit <= 0:
        limit = DEFAULT_LIMIT

    # ========================================================
    # Get target paper
    # ========================================================

    target_paper = (
        db.query(Paper)
        .filter(
            Paper.id == paper_id
        )
        .first()
    )

    if target_paper is None:
        raise ValueError(
            "Paper not found"
        )

    # ========================================================
    # Target topics
    # ========================================================

    target_topics = {
        topic.id
        for topic in (
            target_paper.topics or []
        )
    }

    if not target_topics:
        return []

    # ========================================================
    # Exclude target paper authors
    # ========================================================

    target_author_ids = {
        author.id
        for author in (
            target_paper.authors or []
        )
    }

    # ========================================================
    # Load authors
    # ========================================================

    authors = (
        db.query(Author)
        .all()
    )

    candidates = []

    # ========================================================
    # Evaluate every author
    # ========================================================

    for author in authors:

        # ----------------------------------------------------
        # Never suggest an author of the target paper
        # ----------------------------------------------------

        if author.id in target_author_ids:
            continue

        relevant_papers = []

        # ----------------------------------------------------
        # Inspect author's papers
        # ----------------------------------------------------

        for paper in (
            author.papers or []
        ):

            # Don't count target paper
            if paper.id == paper_id:
                continue

            paper_topics = {
                topic.id
                for topic in (
                    paper.topics or []
                )
            }

            overlapping_topics = (
                target_topics
                & paper_topics
            )

            if not overlapping_topics:
                continue

            relevant_papers.append(
                {
                    "paper": paper,
                    "overlap": overlapping_topics,
                }
            )

        # ----------------------------------------------------
        # Author has no relevant research
        # ----------------------------------------------------

        if not relevant_papers:
            continue

        # ====================================================
        # Distinct topic overlap
        # ====================================================

        overlapping_topic_ids = set()

        for item in relevant_papers:
            overlapping_topic_ids.update(
                item["overlap"]
            )

        topic_overlap_count = len(
            overlapping_topic_ids
        )

        # ====================================================
        # Relevant paper count
        # ====================================================

        relevant_paper_count = len(
            relevant_papers
        )

        # ====================================================
        # Score
        # ====================================================

        # Topic expertise is more important than
        # simply having many papers.

        topic_score = (
            topic_overlap_count * 10
        )

        experience_score = min(
            relevant_paper_count,
            MAX_RELEVANT_PAPERS,
        )

        score = (
            topic_score
            + experience_score
        )

        # ====================================================
        # Collect matched topic names
        # ====================================================

        matched_topic_names = sorted(
            topic.name
            for topic in (
                target_paper.topics or []
            )
            if topic.id
            in overlapping_topic_ids
        )

        candidates.append(
            {
                "author": author,
                "score": score,
                "topic_overlap_count": (
                    topic_overlap_count
                ),
                "relevant_paper_count": (
                    relevant_paper_count
                ),
                "matched_topics": (
                    matched_topic_names
                ),
            }
        )

    # ========================================================
    # Sort
    # ========================================================

    candidates.sort(
        key=lambda candidate: (
            candidate["score"],
            candidate["topic_overlap_count"],
            candidate["relevant_paper_count"],
        ),
        reverse=True,
    )

    # ========================================================
    # Build response
    # ========================================================

    results = []

    for candidate in candidates[:limit]:

        author = candidate["author"]

        topic_count = candidate[
            "topic_overlap_count"
        ]

        paper_count = candidate[
            "relevant_paper_count"
        ]

        matched_topics = candidate[
            "matched_topics"
        ]

        # ----------------------------------------------------
        # Topic wording
        # ----------------------------------------------------

        if topic_count == 1:
            topic_text = (
                "1 overlapping research topic"
            )
        else:
            topic_text = (
                f"{topic_count} overlapping "
                "research topics"
            )

        # ----------------------------------------------------
        # Paper wording
        # ----------------------------------------------------

        if paper_count == 1:
            paper_text = (
                "1 relevant paper"
            )
        else:
            paper_text = (
                f"{paper_count} relevant papers"
            )

        # ----------------------------------------------------
        # Reason
        # ----------------------------------------------------

        if matched_topics:

            topic_names = ", ".join(
                matched_topics[:3]
            )

            reason = (
                f"Research overlap in "
                f"{topic_names}. "
                f"The author has {paper_text} "
                f"on overlapping topics in the "
                f"research corpus."
            )

        else:

            reason = (
                f"Research overlap with this "
                f"paper: {topic_text} across "
                f"{paper_text} in the corpus."
            )

        # ----------------------------------------------------
        # Response
        # ----------------------------------------------------

        results.append(
            {
                "author_id": author.id,
                "name": author.name,
                "reason": reason,
                "topic_overlap_count": (
                    topic_count
                ),
                "relevant_paper_count": (
                    paper_count
                ),
                "matched_topics": (
                    matched_topics
                ),
                "score": candidate["score"],
            }
        )

    return results