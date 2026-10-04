"""Sanitized error handling.

Every error response has the same safe shape: a stable machine-readable ``error``
code, a user-safe ``message``, and a ``correlation_id``. Unhandled exceptions return
a generic message; stack traces and internal details are logged server-side only.
"""

import logging
import uuid

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.exceptions import DomainError

logger = logging.getLogger("districtmind.errors")

# Explicit mapping from stable domain error codes to HTTP status (AD-BE-006: structural 400, not found 404).
DOMAIN_ERROR_STATUS: dict[str, int] = {
    "invalid_district_id": 400,
    "district_not_found": 404,
}


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(DomainError)
    async def _domain_error(request: Request, exc: DomainError) -> JSONResponse:
        status_code = DOMAIN_ERROR_STATUS.get(exc.code, 500)
        correlation_id = str(uuid.uuid4())
        if status_code == 500:
            logger.error("unmapped domain error code=%s correlation_id=%s", exc.code, correlation_id)
            return JSONResponse(
                status_code=500,
                content={
                    "error": "internal_error",
                    "message": "An unexpected error occurred.",
                    "correlation_id": correlation_id,
                },
            )
        return JSONResponse(
            status_code=status_code,
            content={"error": exc.code, "message": exc.message, "correlation_id": correlation_id},
        )

    @app.exception_handler(Exception)
    async def _unhandled(request: Request, exc: Exception) -> JSONResponse:
        correlation_id = str(uuid.uuid4())
        logger.exception("unhandled error correlation_id=%s path=%s", correlation_id, request.url.path)
        return JSONResponse(
            status_code=500,
            content={
                "error": "internal_error",
                "message": "An unexpected error occurred.",
                "correlation_id": correlation_id,
            },
        )
