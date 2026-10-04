"""In-memory reference repository. NOT database persistence.

Used for the Step 2 administrative foundation only. It is replaced by a database
implementation of DistrictRepository without any change to the API contract.
"""

from __future__ import annotations

from collections.abc import Sequence

from app.modules.administrative.domain.models import District


class ReferenceCatalogRepository:
    def __init__(self, districts: Sequence[District]) -> None:
        by_id: dict[str, District] = {}
        for district in districts:
            if district.id in by_id:
                raise ValueError(f"Duplicate district id in reference catalog: {district.id}")
            by_id[district.id] = district
        self._ordered: tuple[District, ...] = tuple(districts)
        self._by_id = by_id

    def list_all(self) -> list[District]:
        return list(self._ordered)

    def get_by_id(self, district_id: str) -> District | None:
        return self._by_id.get(district_id)
