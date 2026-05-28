import allure
import pytest


@pytest.mark.smoke
@allure.title("API health endpoint returns 200")
def test_health_returns_200(api):
    # TODO: replace `/health` with the real endpoint of your API
    response = api.get("/health")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
