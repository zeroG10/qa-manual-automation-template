from appium.webdriver.common.appiumby import AppiumBy
from appium.webdriver.webdriver import WebDriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


class BasePage:
    DEFAULT_TIMEOUT = 15

    def __init__(self, driver: WebDriver):
        self.driver = driver
        self.wait = WebDriverWait(driver, self.DEFAULT_TIMEOUT)

    def find(self, by: str, value: str, timeout: int | None = None):
        wait = WebDriverWait(self.driver, timeout) if timeout else self.wait
        return wait.until(EC.presence_of_element_located((by, value)))

    def tap(self, by: str, value: str) -> None:
        self.find(by, value).click()

    def type(self, by: str, value: str, text: str) -> None:
        el = self.find(by, value)
        el.clear()
        el.send_keys(text)

    def is_visible(self, by: str, value: str, timeout: int = 5) -> bool:
        try:
            WebDriverWait(self.driver, timeout).until(
                EC.visibility_of_element_located((by, value))
            )
            return True
        except Exception:
            return False

    # convenience locators
    @staticmethod
    def by_accessibility_id(value: str):
        return AppiumBy.ACCESSIBILITY_ID, value

    @staticmethod
    def by_android_uiselector(value: str):
        return AppiumBy.ANDROID_UIAUTOMATOR, value

    @staticmethod
    def by_ios_predicate(value: str):
        return AppiumBy.IOS_PREDICATE, value
