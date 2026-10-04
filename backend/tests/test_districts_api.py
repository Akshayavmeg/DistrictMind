from fastapi.testclient import TestClient

from app.api.districts import get_district_service
from app.main import create_app
from app.modules.administrative.repositories.reference_catalog import ReferenceCatalogRepository
from app.modules.administrative.services.district_service import DistrictService


def _client() -> TestClient:
    return TestClient(create_app())


def test_list_returns_200_with_all_33_districts() -> None:
    response = _client().get("/api/v1/districts")
    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 33
    assert len(body["items"]) == 33


def test_list_item_schema_has_only_reference_fields() -> None:
    items = _client().get("/api/v1/districts").json()["items"]
    for item in items:
        assert set(item) == {"id", "name", "state", "status", "reference"}
        assert set(item["reference"]) == {"source", "source_id", "source_url", "vintage"}
        assert item["state"] == "Telangana"
        assert item["status"] == "active"


def test_detail_returns_200_for_a_known_district() -> None:
    response = _client().get("/api/v1/districts/telangana-warangal")
    assert response.status_code == 200
    body = response.json()
    assert body["id"] == "telangana-warangal"
    assert body["name"] == "Warangal"
    assert body["state"] == "Telangana"
    assert body["status"] == "active"


def test_detail_unknown_district_returns_404_with_safe_error_shape() -> None:
    response = _client().get("/api/v1/districts/telangana-atlantis")
    assert response.status_code == 404
    body = response.json()
    assert body["error"] == "district_not_found"
    assert body["message"]
    assert body["correlation_id"]
    assert "Traceback" not in response.text


def test_detail_invalid_identifier_returns_400() -> None:
    response = _client().get("/api/v1/districts/Telangana-Warangal")
    assert response.status_code == 400
    assert response.json()["error"] == "invalid_district_id"


def test_empty_catalog_returns_empty_list_not_an_error() -> None:
    from app.main import create_app as build

    app = build()
    app.dependency_overrides[get_district_service] = lambda: DistrictService(ReferenceCatalogRepository([]))
    response = TestClient(app).get("/api/v1/districts")
    assert response.status_code == 200
    assert response.json() == {"items": [], "total": 0}


def test_responses_do_not_expose_repository_internals() -> None:
    body = _client().get("/api/v1/districts/telangana-warangal").text
    for forbidden in ("_by_id", "_ordered", "repository", "_repository"):
        assert forbidden not in body
