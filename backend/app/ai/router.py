from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.ai.service import summarize_paper
from app.ai.schemas import PaperSummaryResponse


router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


@router.post(
    "/summarize/{paper_id}",
    response_model=PaperSummaryResponse,
)
async def summarize_paper_endpoint(
    paper_id: int,
    db: Session = Depends(get_db),
):

    try:

        return await summarize_paper(
            db=db,
            paper_id=paper_id,
        )

    except ValueError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error),
        )

    except RuntimeError as error:

        raise HTTPException(
            status_code=502,
            detail=str(error),
        )

    except Exception as error:

        print(
            f"[AI ERROR] {error}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate AI summary.",
        )