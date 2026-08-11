from sqlalchemy.orm import Session

from app.models import Paper

from app.ai.openrouter import generate_ai_response
from app.ai.prompts import build_summary_prompt


async def summarize_paper(
    db: Session,
    paper_id: int,
):

    paper = (
        db.query(Paper)
        .filter(
            Paper.id == paper_id
        )
        .first()
    )

    if paper is None:
        raise ValueError(
            "Paper not found."
        )

    if not paper.abstract or not paper.abstract.strip():
        raise ValueError(
            "This paper does not have an abstract "
            "to summarize."
        )

    print(
        f"[AI] Generating summary for paper {paper_id}"
    )

    prompt = build_summary_prompt(
        paper
    )

    summary = await generate_ai_response(
        prompt
    )

    summary = summary.strip()

    # -----------------------------------------------------
    # Basic response validation
    # -----------------------------------------------------

    if not summary:
        raise RuntimeError(
            "AI returned an empty summary."
        )

    invalid_responses = {
        "user safety: safe",
        "user safety: unsafe",
        "safe",
        "unsafe",
    }

    if summary.lower() in invalid_responses:

        raise RuntimeError(
            "AI returned an invalid summary response."
        )

    print(
        f"[AI] Summary generated for paper {paper_id}"
    )

    return {
        "paper_id": paper.id,
        "title": paper.title,
        "summary": summary,
    }