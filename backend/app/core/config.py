from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str

    UPLOAD_DIR: str = "app/uploads"

    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10 MB

    ALLOWED_FILE_TYPES: str = (
        "application/pdf,"
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document,"
        "text/plain"
    )

    FRONTEND_URL: str = "http://localhost:3000"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
    )


settings = Settings()