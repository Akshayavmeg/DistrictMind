from fastapi.testclient import TestClient

from app.main import create_app


def test_health_endpoint_reports_ok() -> None:
    client = TestClient(create_app())
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["service"] == "districtmind-backend"
    assert body["environment"] == "development"


def test_health_response_exposes_no_secret_fields() -> None:
    client = TestClient(create_app())
    body = client.get("/api/v1/health").json()
    assert set(body) == {"status", "service", "environment"}
