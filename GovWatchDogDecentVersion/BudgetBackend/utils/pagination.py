from typing import TypeVar, Generic, List, Optional
from pydantic import BaseModel
from fastapi import Query

T = TypeVar('T')

class PaginationParams(BaseModel):
    page: int = Query(1, ge=1, description="Page number")
    page_size: int = Query(10, ge=1, le=100, description="Items per page")
    sort_by: Optional[str] = Query(None, description="Field to sort by")
    sort_order: Optional[str] = Query("asc", regex="^(asc|desc)$", description="Sort order")

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_previous: bool

def paginate(
    items: List[T],
    total: int,
    params: PaginationParams
) -> PaginatedResponse[T]:
    total_pages = (total + params.page_size - 1) // params.page_size
    
    return PaginatedResponse(
        items=items,
        total=total,
        page=params.page,
        page_size=params.page_size,
        total_pages=total_pages,
        has_next=params.page < total_pages,
        has_previous=params.page > 1
    )