from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_ENV: str = "development"
    LOG_LEVEL: str = "INFO"
    DATABASE_URL: str = "postgresql://frauduser:fraudpass@db:5432/frauddb"
    LLM_PROVIDER: str = "stub"
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
