import dataclasses
import re

from app.modules.administrative.domain.models import District, DistrictStatus
from app.modules.administrative.reference.telangana_districts import TELANGANA_DISTRICTS

ID_FORMAT = re.compile(r"telangana-[a-z]+(?:-[a-z]+)*")


def test_catalog_has_exactly_33_districts() -> None:
    assert len(TELANGANA_DISTRICTS) == 33


def test_district_ids_are_unique() -> None:
    ids = [d.id for d in TELANGANA_DISTRICTS]
    assert len(set(ids)) == 33


def test_district_names_are_unique() -> None:
    names = [d.name for d in TELANGANA_DISTRICTS]
    assert len(set(names)) == 33


def test_all_states_are_telangana() -> None:
    assert {d.state for d in TELANGANA_DISTRICTS} == {"Telangana"}


def test_all_statuses_are_active() -> None:
    assert {d.status for d in TELANGANA_DISTRICTS} == {DistrictStatus.ACTIVE}


def test_ids_are_deterministic_slugs_of_names() -> None:
    for district in TELANGANA_DISTRICTS:
        expected = "telangana-" + "-".join(district.name.lower().split())
        assert district.id == expected
        assert ID_FORMAT.fullmatch(district.id), district.id


def test_warangal_has_the_documented_identifier() -> None:
    warangal = next(d for d in TELANGANA_DISTRICTS if d.name == "Warangal")
    assert warangal.id == "telangana-warangal"


def test_model_carries_no_geometry_or_statistics_fields() -> None:
    allowed = {"id", "name", "state", "status", "reference"}
    assert {f.name for f in dataclasses.fields(District)} == allowed


def test_reference_metadata_does_not_invent_government_identifiers() -> None:
    for district in TELANGANA_DISTRICTS:
        assert district.reference is not None
        assert district.reference.source_id is None
        assert district.reference.source_url is None
        assert district.reference.vintage is None
