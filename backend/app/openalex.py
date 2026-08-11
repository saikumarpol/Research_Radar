import requests


BASE_URL = "https://api.openalex.org/works"


HEADERS = {
    "User-Agent": (
        "ResearchRadar/1.0 "
        "(mailto:your-email@example.com)"
    )
}


def fetch_papers(
    topic: str,
    year: int,
    pages: int = 2,
    per_page: int = 100,
):
    """
    Fetch research papers from OpenAlex
    for a specific topic and publication year.

    We fetch more papers than required because
    the ingestion layer will reject papers that:
    - have no abstract
    - have invalid metadata
    - are duplicates
    """

    papers = []

    for page in range(1, pages + 1):

        print(
            f"Fetching '{topic}' "
            f"- {year} "
            f"- page {page}/{pages}"
        )

        params = {
            "search": topic,
            "page": page,
            "per-page": per_page,
            "sort": "publication_date:desc",

            # Only retrieve papers from the
            # requested publication year.
            "filter": (
                f"from_publication_date:"
                f"{year}-01-01,"
                f"to_publication_date:"
                f"{year}-12-31"
            ),
        }

        response = requests.get(
            BASE_URL,
            params=params,
            headers=HEADERS,
            timeout=30,
        )

        response.raise_for_status()

        data = response.json()

        results = data.get(
            "results",
            [],
        )

        if not results:
            break

        papers.extend(results)

        print(
            f"  Received {len(results)} papers"
        )

    return papers