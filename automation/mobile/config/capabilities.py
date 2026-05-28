from pathlib import Path

from appium.options.android import UiAutomator2Options
from appium.options.ios import XCUITestOptions

from config.settings import settings


def _resolve_app_path(relative: str) -> str:
    p = Path(relative)
    if not p.is_absolute():
        p = Path(__file__).resolve().parents[1] / p
    return str(p)


def android_caps() -> UiAutomator2Options:
    opts = UiAutomator2Options()
    opts.platform_name = "Android"
    opts.platform_version = settings.android_platform_version
    opts.device_name = settings.android_device_name
    opts.app = _resolve_app_path(settings.android_app_path)
    opts.app_package = settings.android_app_package
    opts.app_activity = settings.android_app_activity
    opts.automation_name = "Flutter" if settings.flutter_enabled else "UiAutomator2"
    opts.auto_grant_permissions = True
    opts.new_command_timeout = 300
    return opts


def ios_caps() -> XCUITestOptions:
    opts = XCUITestOptions()
    opts.platform_name = "iOS"
    opts.platform_version = settings.ios_platform_version
    opts.device_name = settings.ios_device_name
    opts.app = _resolve_app_path(settings.ios_app_path)
    opts.bundle_id = settings.ios_bundle_id
    opts.automation_name = "Flutter" if settings.flutter_enabled else "XCUITest"
    opts.new_command_timeout = 300
    return opts


def get_capabilities(platform: str):
    platform = platform.lower()
    if platform == "android":
        return android_caps()
    if platform == "ios":
        return ios_caps()
    raise ValueError(f"Unsupported platform: {platform}")
