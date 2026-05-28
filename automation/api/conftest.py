import allure
import pytest

from clients.base_client import ApiClient
from config.settings import settings


@pytest.fixture(scope="session", autouse=True)
def _env_label():
    allure.dynamic.label("env", settings.api_env)
    allure.dynamic.label("base_url", settings.api_base_url)


@pytest.fixture
def api() -> ApiClient:
    with ApiClient() as client:
        yield client


@pytest.hookimpl(hookwrapper=True, tryfirst=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    if report.when == "call" and report.failed:
        allure.attach(
            f"Test: {item.nodeid}\nFailed at: {report.longrepr}",
            name="failure-context",
            attachment_type=allure.attachment_type.TEXT,
        )
