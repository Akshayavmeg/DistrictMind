"""Administrative reference model.

This is identity and administrative status only. It deliberately has NO geometry,
coordinates, area, population, or statistics fields. Those belong to spatial and
statistical layers that attach to a district only after data/GIS gates are cleared
(see docs/implementation/step-2-administrative-foundation.md).
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import StrEnum


class DistrictStatus(StrEnum):
    """Controlled lifecycle values. Add members here as lifecycle states are approved."""

    ACTIVE = "active"


@dataclass(frozen=True)
class ReferenceMetadata:
    """Optional provenance for an administrative reference entry. Unknown values stay None."""

    source: str | None = None
    source_id: str | None = None
    source_url: str | None = None
    vintage: str | None = None


@dataclass(frozen=True)
class District:
    id: str
    name: str
    state: str
    status: DistrictStatus
    reference: ReferenceMetadata | None = None
