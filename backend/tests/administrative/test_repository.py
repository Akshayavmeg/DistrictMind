import pytest

from app.modules.administrative.domain.models import District, DistrictStatus
from app.modules.administrative.reference.telangana_districts import TELANGANA_DISTRICTS
from app.modules.administrative.repositories.reference_catalog import ReferenceCatalogRepository


def test_list_returns_the_whole_catalog_in_order() -> None:
    repo = ReferenceCatalogRepository(TELANGANA_DISTRICTS)
    assert repo.list_all() == list(TELANGANA_DISTRICTS)


def test_valid_lookup_succeeds() -> None:
    repo = ReferenceCatalogRepository(TELANGANA_DISTRICTS)
    district = repo.get_by_id("telangana-warangal")
    assert district is not None
    assert district.name == "Warangal"


def test_unknown_lookup_returns_none() -> None:
    repo = ReferenceCatalogRepository(TELANGANA_DISTRICTS)
    assert repo.get_by_id("telangana-not-a-district") is None


def test_list_returns_a_copy_not_the_internal_store() -> None:
    repo = ReferenceCatalogRepository(TELANGANA_DISTRICTS)
    repo.list_all().clear()
    assert len(repo.list_all()) == 33


def test_duplicate_ids_are_rejected_at_construction() -> None:
    duplicate = District(id="telangana-x", name="X", state="Telangana", status=DistrictStatus.ACTIVE)
    with pytest.raises(ValueError, match="Duplicate district id"):
        ReferenceCatalogRepository([duplicate, duplicate])


def test_empty_catalog_is_valid() -> None:
    repo = ReferenceCatalogRepository([])
    assert repo.list_all() == []
    assert repo.get_by_id("telangana-warangal") is None
