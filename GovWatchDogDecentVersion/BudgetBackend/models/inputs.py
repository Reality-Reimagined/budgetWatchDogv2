from pydantic import BaseModel, EmailStr, Field
from typing import Optional

# Input Model
class ReportRequest(BaseModel):
    government_level: str = Field(..., description="Province or Federal")
    province: Optional[str] = Field(None, description="Specify province if applicable")
    report_type: str = Field(..., description="Summary, Full Report, or Specific Section")
    user_name: str = Field(..., description="Your full name")
    company_email: EmailStr = Field(..., description="Your company email")
