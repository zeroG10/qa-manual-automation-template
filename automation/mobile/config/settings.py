from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[1] / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    appium_host: str = "127.0.0.1"
    appium_port: int = 4723

    platform: str = "android"

    android_device_name: str = "Pixel_7_API_34"
    android_platform_version: str = "14"
    android_app_path: str = "./builds/app-debug.apk"
    android_app_package: str = "com.example.app"
    android_app_activity: str = "com.example.app.MainActivity"

    ios_device_name: str = "iPhone 15"
    ios_platform_version: str = "17.4"
    ios_app_path: str = "./builds/App.app"
    ios_bundle_id: str = "com.example.app"

    flutter_enabled: bool = False

    @property
    def appium_url(self) -> str:
        return f"http://{self.appium_host}:{self.appium_port}"


settings = Settings()
