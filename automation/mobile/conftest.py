import allure
import pytest
from appium import webdriver

from config.capabilities import get_capabilities
from config.settings import settings


def pytest_addoption(parser):
    parser.addoption(
        "--platform",
        action="store",
        default=None,
        help="Override platform: android | ios",
    )


@pytest.fixture(scope="session")
def platform(request) -> str:
    return (request.config.getoption("--platform") or settings.platform).lower()


@pytest.fixture
def driver(platform):
    caps = get_capabilities(platform)
    drv = webdriver.Remote(settings.appium_url, options=caps)
    drv.implicitly_wait(10)
    yield drv
    drv.quit()


@pytest.hookimpl(hookwrapper=True, tryfirst=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    if report.when == "call" and report.failed:
        drv = item.funcargs.get("driver")
        if drv is not None:
            try:
                allure.attach(
                    drv.get_screenshot_as_png(),
                    name="screenshot-on-failure",
                    attachment_type=allure.attachment_type.PNG,
                )
                allure.attach(
                    drv.page_source,
                    name="page-source",
                    attachment_type=allure.attachment_type.XML,
                )
            except Exception:
                pass
