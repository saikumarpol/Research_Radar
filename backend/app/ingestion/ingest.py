from datetime import date, datetime

from app.openalex import fetch_papers
from app.database import SessionLocal

from app.models import (
    Paper,
    Author,
    Topic,
)


# ============================================================
# RESEARCH RADAR CATEGORIES
# ============================================================

TOPICS = [
    "Computer Vision",
    "Natural Language Processing",
    "Machine Learning",
    "Robotics",
    "Data Science",
]


# ============================================================
# YEAR DISTRIBUTION
# ============================================================

YEARS = [
    2026,
    2025,
    2024,
    2023,
]


# ============================================================
# TARGET PAPERS
# ============================================================

PAPERS_PER_YEAR = 20


# ============================================================
# BUILD ABSTRACT
# ============================================================

def build_abstract(
    abstract_index,
):
    """
    Convert OpenAlex abstract_inverted_index
    into readable text.
    """

    if not abstract_index:
        return ""

    words = []

    for word, positions in abstract_index.items():

        for position in positions:

            words.append(
                (position, word)
            )

    words.sort(
        key=lambda item: item[0]
    )

    return " ".join(
        word
        for _, word in words
    )


# ============================================================
# GET OR CREATE AUTHOR
# ============================================================

def get_or_create_author(
    db,
    author_data,
):
    """
    Find an author by OpenAlex ID.

    Create the author if it does not already exist.
    """

    openalex_id = author_data.get("id")

    if not openalex_id:
        return None

    author = (
        db.query(Author)
        .filter(
            Author.openalex_id
            == openalex_id
        )
        .first()
    )

    if author:
        return author

    author = Author(
        openalex_id=openalex_id,
        name=(
            author_data.get(
                "display_name"
            )
            or "Unknown"
        ),
    )

    db.add(author)

    db.flush()

    return author


# ============================================================
# GET OR CREATE TOPIC
# ============================================================

def get_or_create_topic(
    db,
    topic_name,
):
    """
    Find a topic by name.

    Create the topic if it does not exist.
    """

    topic = (
        db.query(Topic)
        .filter(
            Topic.name == topic_name
        )
        .first()
    )

    if topic:
        return topic

    topic = Topic(
        name=topic_name
    )

    db.add(topic)

    db.flush()

    return topic


# ============================================================
# INGEST
# ============================================================

def ingest():

    db = SessionLocal()

    total_inserted = 0
    total_existing = 0
    total_invalid = 0

    try:

        # ========================================================
        # CATEGORY LOOP
        # ========================================================

        for category in TOPICS:

            print()
            print("=" * 60)
            print(
                f"RESEARCH CATEGORY: {category}"
            )
            print("=" * 60)

            # ----------------------------------------------------
            # Create the main Research Radar category.
            # ----------------------------------------------------

            category_topic = (
                get_or_create_topic(
                    db,
                    category,
                )
            )

            category_total = 0

            # ====================================================
            # YEAR LOOP
            # ====================================================

            for year in YEARS:

                print()
                print(
                    f"Fetching {category} - {year}"
                )

                # ------------------------------------------------
                # Fetch more than 20 so that invalid records
                # can be skipped while still finding 20 valid
                # papers.
                # ------------------------------------------------

                papers = fetch_papers(
                    topic=category,
                    year=year,
                    pages=2,
                    per_page=100,
                )

                year_inserted = 0

                # =================================================
                # PAPER LOOP
                # =================================================

                for item in papers:

                    # ------------------------------------------------
                    # Stop once we have 20 valid papers for this year.
                    # ------------------------------------------------

                    if (
                        year_inserted
                        >= PAPERS_PER_YEAR
                    ):
                        break

                    # =================================================
                    # OPENALEX ID
                    # =================================================

                    openalex_id = item.get("id")

                    if not openalex_id:

                        total_invalid += 1

                        continue

                    # =================================================
                    # CHECK DUPLICATE
                    # =================================================

                    existing = (
                        db.query(Paper)
                        .filter(
                            Paper.openalex_id
                            == openalex_id
                        )
                        .first()
                    )

                    if existing:

                        total_existing += 1

                        continue

                    # =================================================
                    # TITLE
                    # =================================================

                    title = (
                        item.get(
                            "display_name"
                        )
                        or ""
                    ).strip()

                    if not title:

                        total_invalid += 1

                        print(
                            "Skipping paper "
                            "without title"
                        )

                        continue

                    # =================================================
                    # ABSTRACT
                    # =================================================

                    abstract = build_abstract(
                        item.get(
                            "abstract_inverted_index"
                        )
                    )

                    if not abstract.strip():

                        total_invalid += 1

                        print(
                            "Skipping paper "
                            "without abstract:"
                        )

                        print(
                            f"  {title}"
                        )

                        continue

                    # =================================================
                    # PUBLICATION YEAR
                    # =================================================

                    publication_year = (
                        item.get(
                            "publication_year"
                        )
                    )

                    if (
                        publication_year
                        != year
                    ):

                        total_invalid += 1

                        print(
                            "Skipping incorrect year:"
                        )

                        print(
                            f"  Expected: {year}"
                        )

                        print(
                            f"  Received: "
                            f"{publication_year}"
                        )

                        continue

                    # =================================================
                    # PUBLICATION DATE
                    # =================================================

                    publication_date = (
                        item.get(
                            "publication_date"
                        )
                    )

                    if not publication_date:

                        total_invalid += 1

                        continue

                    try:

                        publication_date_obj = (
                            datetime.strptime(
                                publication_date,
                                "%Y-%m-%d",
                            ).date()
                        )

                    except ValueError:

                        total_invalid += 1

                        print(
                            "Skipping invalid "
                            "publication date:"
                        )

                        print(
                            f"  {publication_date}"
                        )

                        continue

                    # =================================================
                    # FUTURE DATE SAFETY
                    # =================================================

                    if (
                        publication_date_obj
                        > date.today()
                    ):

                        total_invalid += 1

                        print(
                            "Skipping future "
                            "publication:"
                        )

                        print(
                            f"  {publication_date}"
                        )

                        continue

                    # =================================================
                    # CREATE PAPER
                    # =================================================

                    paper = Paper(
                        openalex_id=openalex_id,
                        title=title,
                        abstract=abstract,
                        publication_year=(
                            publication_year
                        ),
                        publication_date=(
                            publication_date
                        ),
                        doi=item.get("doi"),
                        cited_by_count=(
                            item.get(
                                "cited_by_count",
                                0,
                            )
                            or 0
                        ),
                    )

                    db.add(paper)

                    db.flush()

                    # =================================================
                    # ADD MAIN RESEARCH RADAR CATEGORY
                    # =================================================

                    paper.topics.append(
                        category_topic
                    )

                    seen_topic_ids = {
                        category_topic.id
                    }

                    # =================================================
                    # ADD OPENALEX CONCEPTS
                    # =================================================

                    concepts = item.get(
                        "concepts",
                        [],
                    )

                    for concept in concepts[:5]:

                        topic_name = (
                            concept.get(
                                "display_name"
                            )
                        )

                        if not topic_name:
                            continue

                        topic = (
                            get_or_create_topic(
                                db,
                                topic_name,
                            )
                        )

                        if (
                            topic.id
                            in seen_topic_ids
                        ):
                            continue

                        seen_topic_ids.add(
                            topic.id
                        )

                        paper.topics.append(
                            topic
                        )

                    # =================================================
                    # ADD AUTHORS
                    # =================================================

                    seen_author_ids = set()

                    authorships = item.get(
                        "authorships",
                        [],
                    )

                    for authorship in authorships:

                        author_data = (
                            authorship.get(
                                "author",
                                {},
                            )
                        )

                        author = (
                            get_or_create_author(
                                db,
                                author_data,
                            )
                        )

                        if not author:
                            continue

                        if (
                            author.id
                            in seen_author_ids
                        ):
                            continue

                        seen_author_ids.add(
                            author.id
                        )

                        paper.authors.append(
                            author
                        )

                    # =================================================
                    # SUCCESS
                    # =================================================

                    year_inserted += 1

                    category_total += 1

                    total_inserted += 1

                    print(
                        f"  ✓ {year} "
                        f"paper "
                        f"{year_inserted}/"
                        f"{PAPERS_PER_YEAR}"
                    )

                # =================================================
                # YEAR SUMMARY
                # =================================================

                print()
                print(
                    f"{category} | {year}: "
                    f"{year_inserted} papers"
                )

            # ====================================================
            # CATEGORY COMMIT
            # ====================================================

            db.commit()

            print()
            print(
                f"{category} TOTAL: "
                f"{category_total} papers"
            )

    except Exception:

        db.rollback()

        print()
        print(
            "Ingestion failed."
        )

        print(
            "Current transaction "
            "has been rolled back."
        )

        raise

    finally:

        db.close()

    # ============================================================
    # FINAL SUMMARY
    # ============================================================

    target_total = (
        len(TOPICS)
        * len(YEARS)
        * PAPERS_PER_YEAR
    )

    print()
    print("=" * 60)
    print("INGESTION COMPLETE")
    print("=" * 60)

    print(
        f"New papers inserted : "
        f"{total_inserted}"
    )

    print(
        f"Existing papers     : "
        f"{total_existing}"
    )

    print(
        f"Invalid papers      : "
        f"{total_invalid}"
    )

    print(
        f"Target corpus       : "
        f"{target_total}"
    )

    print("=" * 60)


# ============================================================
# ENTRY POINT
# ============================================================

if __name__ == "__main__":
    ingest()