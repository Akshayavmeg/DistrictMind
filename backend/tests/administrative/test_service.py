import pytest

from app.modules.administrative.domain.errors import DistrictNotFoundError, InvalidDistrictIdError
from app.modules.administrative.reference.telangana_districts import TELANGANA_DISTRICTS
from app.modules.administrative.repositories.reference_catalog import ReferenceCatalogRepository
from app.modules.administrative.services.district_service import DistrictService


@pytest.fixture
def service() -> DistrictService:
    return DistrictService(ReferenceCatalogRepository(TELANGANA_DISTRICTS))


def test_list_districts_returns_all_33(service: DistrictService) -> None:
    assert len(service.list_districts()) == 33


def test_valid_retrieval_returns_the_district(service: DistrictService) -> None:
    district = service.get_district("telangana-warangal")
    assert district.name == "Warangal"
    assert district.state == "Telangana"


def test_unknown_retrieval_raises_not_found(service: DistrictService) -> None:
    with pytest.raises(DistrictNotFoundError) as info:
        service.get_district("telangana-atlantis")
    assert info.value.code == "district_not_found"


@pytest.mark.parametrize(
    "bad_id",
    ["Telangana-Warangal", "telangana warangal", "../etc", "telangana--warangal", "-leading", "x" * 65, ""],
)
def test_invalid_identifier_format_is_rejected(service: DistrictService, bad_id: str) -> None:
    with pytest.raises(InvalidDistrictIdError) as info:
        service.get_district(bad_id)
    assert info.value.code == "invalid_district_id"


def test_empty_catalog_lists_nothing_and_finds_nothing() -> None:
    empty = DistrictService(ReferenceCatalogRepository([]))
    assert empty.list_districts() == []
    with pytest.raises(DistrictNotFoundError):
        empty.get_district("telangana-warangal")
