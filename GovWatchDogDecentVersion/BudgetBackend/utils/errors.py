from fastapi import HTTPException, status
from typing import Optional, Dict, Any

class BaseAPIError(HTTPException):
    def __init__(
        self,
        status_code: int,
        message: str,
        error_code: str,
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            status_code=status_code,
            detail={
                "message": message,
                "error_code": error_code,
                "details": details or {}
            }
        )

class ValidationError(BaseAPIError):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=message,
            error_code="VALIDATION_ERROR",
            details=details
        )

class DataNotFoundError(BaseAPIError):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            message=message,
            error_code="DATA_NOT_FOUND",
            details=details
        )

class DatabaseError(BaseAPIError):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=message,
            error_code="DATABASE_ERROR",
            details=details
        )