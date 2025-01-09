import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app import auth
from unittest.mock import MagicMock, patch
from app.utils.email import ConnectionConfig
import os

TEST_DATABASE_URL = "postgresql://user:password@db:5432/application-tracker"

mock_config = MagicMock()

mock_config.MAIL_USERNAME = "test"
mock_config.MAIL_PASSWORD = "test"
mock_config.MAIL_FROM = "test@example.com"
mock_config.MAIL_PORT = 587
mock_config.MAIL_SERVER = "smtp.test.com"
mock_config.MAIL_STARTTLS = True
mock_config.MAIL_SSL_TLS = False
mock_config.USE_CREDENTIALS = True

@pytest.fixture(autouse=True, scope="session")
def mock_connection_config():
    with patch('app.utils.email.ConnectionConfig', return_value=mock_config):
        yield mock_config

class TestConfig:
    MAIL_SUPPRESS_SEND = True

@pytest.fixture(scope="session")
def engine():
    return create_engine(TEST_DATABASE_URL)

@pytest.fixture(scope="session")
def TestingSessionLocal(engine):
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(autouse=True)
def db(engine):
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(autouse=True)
def short_token_expiry():
    original_expire = auth.ACCESS_TOKEN_EXPIRE_MINUTES
    auth.ACCESS_TOKEN_EXPIRE_MINUTES = 0.083 # 5 seconds
    yield
    auth.ACCESS_TOKEN_EXPIRE_MINUTES = original_expire

