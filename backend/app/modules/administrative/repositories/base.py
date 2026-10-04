from __future__ import annotations

from typing import Protocol

from app.modules.administrative.domain.models import District


class DistrictRepository(Protocol):
    """Storage-agnostic contract. A future PostgreSQL implementation must satisfy this unchanged."""

    def list_all(self) -> list[District]: ...

    def get_by_id(self, district_id: str) -> District | None: ...
