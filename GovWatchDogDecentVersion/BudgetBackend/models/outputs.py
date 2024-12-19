from pydantic import BaseModel, Field
from typing import List

# Output Model
class ReportOutput(BaseModel):
    file_path: str = Field(..., description="Path to the generated Markdown file")
    graphs: List[str] = Field(..., description="List of generated graph file paths")
    tables: List[dict] = Field(..., description="Generated tables for the report")
