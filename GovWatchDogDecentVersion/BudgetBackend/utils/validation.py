from typing import Dict, Any, Optional
from pydantic import BaseModel, validator
from datetime import datetime

class DateRangeFilter(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

    @validator('end_date')
    def validate_date_range(cls, end_date, values):
        start_date = values.get('start_date')
        if start_date and end_date and end_date < start_date:
            raise ValueError("end_date must be after start_date")
        return end_date

class DataFilter(BaseModel):
    government_level: Optional[str] = None
    province: Optional[str] = None
    metric: Optional[str] = None
    date_range: Optional[DateRangeFilter] = None

    @validator('government_level')
    def validate_government_level(cls, v):
        if v and v not in ['Federal', 'Province']:
            raise ValueError("government_level must be either 'Federal' or 'Province'")
        return v

    @validator('province')
    def validate_province(cls, v, values):
        if values.get('government_level') == 'Province' and not v:
            raise ValueError("province is required when government_level is 'Province'")
        return v

    @validator('metric')
    def validate_metric(cls, v):
        valid_metrics = ['gdp_growth', 'inflation_rate', 'employment_growth', 'debt_to_gdp']
        if v and v not in valid_metrics:
            raise ValueError(f"metric must be one of: {', '.join(valid_metrics)}")
        return v