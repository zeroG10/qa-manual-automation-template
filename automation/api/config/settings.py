from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[1] / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    api_base_url: str = "https://api.example.com"
    api_timeout_seconds: int = 30
    api_token: str = ""
    api_username: str = ""
    api_password: str = ""
    api_env: str = "staging"


settings = Settings()
