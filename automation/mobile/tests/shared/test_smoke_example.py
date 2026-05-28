import allure
import pytest


@pytest.mark.smoke
@allure.title("App launches and shows initial screen")
def test_app_launches(driver):
    assert driver.session_id is not None
    # TODO: replace with a real first-screen assertion
    # e.g. assert BasePage(driver).is_visible(*BasePage.by_accessibility_id("welcome_title"))
