from pydantic import BaseModel


class PaperSummaryResponse(BaseModel):

    paper_id: int

    title: str

    summary: str