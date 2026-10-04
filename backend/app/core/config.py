"""Application settings, read from environment variables.

Values come from the process environment, with an optional repository-root
``.env`` file for local development. Secrets are never defaulted in code.
"""

from __future__ import annotations

from pathlib import Path
from typing import Literal

from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

REPO_ROOT = Path(__file__).resolve().parents[3]
ENV_FILE = REPO_ROOT / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ENV_FILE, env_file_encoding="utf-8", extra="ignore")

    app_env: Literal["development", "test", "staging", "production"] = "development"
    api_prefix: str = "/api/v1"
    service_name: str = "districtmind-backend"

    # Development-only authentication stub. Must never be "development" outside app_env=development.
    auth_mode: Literal["development", "disabled"] = "development"

    cors_origins: str = Field(
        default="http://localhost:5173,http://127.0.0.1:5173",
        description="Comma-separated explicit origins. Development default covers both loopback spellings.",
    )

    # Conceptual placeholders for later phases. Not used by Step 1.
    database_url: str | None = None
    secret_key: str | None = None
    ollama_base_url: str = "http://127.0.0.1:11434"
    model_name: str = "llama3.2:3b"
    chroma_path: str = "./data/chroma"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @model_validator(mode="after")
    def _dev_auth_only_in_development(self) -> Settings:
        if self.auth_mode == "development" and self.app_env != "development":
            raise ValueError("AUTH_MODE=development is only permitted when APP_ENV=development")
        return self


def get_settings() -> Settings:
    return Settings()
