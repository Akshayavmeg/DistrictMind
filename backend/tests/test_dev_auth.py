import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.core.config import Settings
from app.main import create_app


def test_dev_login_available_in_development() -> None:
    client = TestClient(create_app())
    response = client.post("/api/v1/auth/dev-login")
    assert response.status_code == 200
    body = response.json()
    assert body["mode"] == "development"
    assert "NOT REAL AUTHENTICATION" in body["warning"]
    assert "token" not in body and "password" not in body


def test_dev_login_route_absent_when_auth_disabled(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("AUTH_MODE", "disabled")
    client = TestClient(create_app())
    response = client.post("/api/v1/auth/dev-login")
    assert response.status_code == 404


def test_dev_auth_mode_rejected_outside_development() -> None:
    with pytest.raises(ValidationError):
        Settings(app_env="production", auth_mode="development")
