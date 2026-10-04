"""Sanitized error handling.

Unhandled exceptions return a generic message and a correlation ID. Stack
traces and internal details are logged server-side and never returned.
"""

import logging
import uuid

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

logger = logging.getLogger("districtmind.errors")


def register_error_handlers(app: FastAPI) -> None:
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
