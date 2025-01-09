import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app import auth

TEST_DATABASE_URL = "postgresql://user:password@db:5432/application-tracker"

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