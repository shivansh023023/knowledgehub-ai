from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str

    UPLOAD_DIR: str

    MAX_UPLOAD_SIZE: int

    ALLOWED_FILE_TYPES: str

    FRONTEND_URL: str

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
    )


settings = Settings()