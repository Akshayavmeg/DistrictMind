"""Administrative application service. Business rules live here, not in API routes."""

from __future__ import annotations

import re

from app.modules.administrative.domain.errors import DistrictNotFoundError, InvalidDistrictIdError
from app.modules.administrative.domain.models import District
from app.modules.administrative.repositories.base import DistrictRepository

# Lowercase words joined by single hyphens, e.g. "telangana-warangal".
_ID_PATTERN = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)*")
_MAX_ID_LENGTH = 64


class DistrictService:
    def __init__(self, repository: DistrictRepository) -> None:
        self._repository = repository

    def list_districts(self) -> list[District]:
        return self._repository.list_all()

    def get_district(self, district_id: str) -> District:
        if len(district_id) > _MAX_ID_LENGTH or not _ID_PATTERN.fullmatch(district_id):
            raise InvalidDistrictIdError()
        district = self._repository.get_by_id(district_id)
        if district is None:
            raise DistrictNotFoundError()
        return district
