"""The 33-district Telangana administrative reference catalog.

Names and spellings are taken from the list recorded in
docs/engineering/24_Evidence_Deep_Validation_and_PoC/boundary-dataset-deep-validation.md
(ED-M6 Part 3, VAL-M6-P3-002). That record states the list came from an aggregator copy of
LGD districts with no detected license, so spellings are NOT independently verified against
a primary publication. No coordinates, government codes, populations, or geometry appear here.
"""

from app.modules.administrative.domain.models import District, DistrictStatus, ReferenceMetadata

_PROVENANCE = ReferenceMetadata(
    source=(
        "docs/engineering/24_Evidence_Deep_Validation_and_PoC/"
        "boundary-dataset-deep-validation.md (VAL-M6-P3-002 district names)"
    ),
)

_DISTRICT_NAMES: tuple[str, ...] = (
    "Adilabad",
    "Bhadradri Kothagudem",
    "Hanumakonda",
    "Hyderabad",
    "Jagitial",
    "Jangoan",
    "Jayashankar Bhupalapally",
    "Jogulamba Gadwal",
    "Kamareddy",
    "Karimnagar",
    "Khammam",
    "Kumuram Bheem Asifabad",
    "Mahabubabad",
    "Mahabubnagar",
    "Mancherial",
    "Medak",
    "Medchal Malkajgiri",
    "Mulugu",
    "Nagarkurnool",
    "Nalgonda",
    "Narayanpet",
    "Nirmal",
    "Nizamabad",
    "Peddapalli",
    "Rajanna Sircilla",
    "Rangareddy",
    "Sangareddy",
    "Siddipet",
    "Suryapet",
    "Vikarabad",
    "Wanaparthy",
    "Warangal",
    "Yadadri Bhuvanagiri",
)


def _slug(name: str) -> str:
    return "-".join(name.lower().split())


TELANGANA_DISTRICTS: tuple[District, ...] = tuple(
    District(
        id=f"telangana-{_slug(name)}",
        name=name,
        state="Telangana",
        status=DistrictStatus.ACTIVE,
        reference=_PROVENANCE,
    )
    for name in _DISTRICT_NAMES
)
