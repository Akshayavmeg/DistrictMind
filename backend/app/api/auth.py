"""DEVELOPMENT LOGIN STUB — NOT REAL AUTHENTICATION.

Exists only so the development frontend can exercise a login → navigation flow.
It checks no password, stores no user, and issues no token. It is available only
when AUTH_MODE=development, which the settings validator forbids outside
APP_ENV=development. When AUTH_MODE is not development the route does not exist.

To replace: remove this module and the router include, then add the real provider.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.core.config import Settings, get_settings

router = APIRouter(prefix="/auth", tags=["auth (development stub)"])


class DevUser(BaseModel):
    id: str
    display_name: str


class DevLoginResponse(BaseModel):
    authenticated: bool
    mode: str
    user: DevUser
    warning: str


@router.post("/dev-login", response_model=DevLoginResponse)
def dev_login(settings: Settings = Depends(get_settings)) -> DevLoginResponse:
    if settings.auth_mode != "development":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    return DevLoginResponse(
        authenticated=True,
        mode="development",
        user=DevUser(id="dev-user", display_name="Development User"),
        warning="DEVELOPMENT LOGIN — NOT REAL AUTHENTICATION",
    )
