import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_db

@pytest.fixture
def client(db, TestingSessionLocal):
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    test_client = TestClient(app)
    yield test_client
    app.dependency_overrides.clear()

# Helper function to register a user to database
@pytest.fixture
def registered_user(client):
    user_data = { "email": "test@example.com", "password": "testpassword123" }
    response = client.post('register', json=user_data)
    assert response.status_code == 200

    return user_data

# Testing creating a user
def test_create_user(client):
    response = client.post(
        "/register",
        json={"email": "test@example.com", "password": "testpassword123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "password" not in data

# Testing user login
def test_login(client, registered_user):
    response = client.post(
        "/token", 
        data={
            "username": registered_user["email"],
            "password": registered_user["password"]
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

