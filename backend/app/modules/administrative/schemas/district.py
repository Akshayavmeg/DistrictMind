"""Response schemas for the administrative API. They map from domain models and never expose repository internals."""

from __future__ import annotations

from pydantic import BaseModel

from app.modules.administrative.domain.models import District, DistrictStatus, ReferenceMetadata


class ReferenceMetadataSchema(BaseModel):
    source: str | None
    source_id: str | None
    source_url: str | None
    vintage: str | None

    @classmethod
    def from_domain(cls, reference: ReferenceMetadata) -> ReferenceMetadataSchema:
        return cls(
            source=reference.source,
            source_id=reference.source_id,
            source_url=reference.source_url,
            vintage=reference.vintage,
        )


class DistrictSchema(BaseModel):
    id: str
    name: str
    state: str
    status: DistrictStatus
    reference: ReferenceMetadataSchema | None

    @classmethod
    def from_domain(cls, district: District) -> DistrictSchema:
        return cls(
            id=district.id,
            name=district.name,
            state=district.state,
            status=district.status,
            reference=ReferenceMetadataSchema.from_domain(district.reference) if district.reference else None,
        )


class DistrictListSchema(BaseModel):
    """List envelope. Pagination mechanics are Under Evaluation (api-design-principles.md §6).

    All 33 entries are returned until that decision is made.
    """

    items: list[DistrictSchema]
    total: int
