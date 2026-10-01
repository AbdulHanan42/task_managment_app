from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=(".env", ".env.smtp"), extra="ignore")

    DB_CONNECTION: str
    SECRET_KEY: str
    ALGORITHM: str
    EXP_Time: int
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    MAIL_USERNAME: str | None = None
    MAIL_PASSWORD: str | None = None
    MAIL_FROM: str | None = None
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_FROM_NAME: str = "Task Manager"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False

settings = Settings()