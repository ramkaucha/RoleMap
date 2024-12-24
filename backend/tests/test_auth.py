import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_db
import time

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
    user_data = { "email": "test@example.com", "password": "StrongPassword123!@#", "first_name": 'Bob', "last_name": "Kuzami"}
    response = client.post('register', json=user_data)
    assert response.status_code == 200

    return user_data

# Testing creating a user
def test_create_user(client):
    response = client.post(
        "/register",
        json={"email": "test@example.com", "password": "StrongPassword123!@#", "first_name": "Bob", "last_name": "Kuzami"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "password" not in data
    assert data['first_name'] == 'Bob'
    assert data['last_name'] == 'Kuzami'

# Email already registered
def test_register_duplicate(client, registered_user):
    response = client.post(
        '/register',
        json={
            "email": "test@example.com",
            "password": "StrongPassword1231!@",
            "first_name": "Bob",
            "last_name": "Kuzami"
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"

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

# Testing user logging in with incorrect password
def test_login_incorrect_password(client, registered_user):
    response = client.post(
        "/token",
        data={
            "username": registered_user['email'],
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"

# Testing user logging in with incorrect email
def test_login_incorrect_email(client, registered_user):
    response = client.post(
        "/token",
        data={
            "username": "randomemail@email.com",
            "password": registered_user["password"]
        }
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"

def test_register_weak_password(client):
    response = client.post(
        "/register",
        json={
            "email": "test@example.com",
            "password": "weakpassword123",
            "first_name": "Bob",
            "last_name": "Kazumi"
        }
    )

    assert response.status_code == 422
    assert response.json()["detail"][0]["msg"] == "Value error, Password must contain at least one uppercase letter"

# Passing in password as empty string
def test_register_empty_password(client):
    response = client.post(
        "/register",
        json={
            "email": "test@example.com",
            "password": "",
            "first_name": "Bob",
            "last_name": "Kazumi"
        }
    )

    assert response.status_code == 422
    assert response.json()["detail"][0]["msg"] == "Value error, Password must be more than 8 characters long"

# Testing invalid address
def test_register_invalid_email(client):
    response = client.post(
        "/register",
        json={
            "email": "ivalid-email",
            "password": "Strongpassword123@!"
        }
    )

    assert response.status_code == 422
    assert response.json()['detail'][0]['msg'] == "value is not a valid email address: An email address must have an @-sign."

# Token testing

# Verify token format after login
def test_token_format(client, registered_user):
    response = client.post(
        '/token',
        data={
            "username": registered_user["email"],
            "password": registered_user["password"]
        }
    )

    assert response.status_code == 200
    token_data = response.json()

    assert "access_token" in token_data
    assert "token_type" in token_data
    assert token_data["token_type"] == "bearer"

    assert len(token_data["access_token"]) > 0

# test token expiration
def test_token_expiration(client, registered_user):
    response = client.post(
        '/token',
        data={
            "username": registered_user['email'],
            "password": registered_user['password']
        }
    )

    token = response.json()['access_token']

    # using token
    response = client.get(
        '/users/me',
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200

    time.sleep(6)

    response = client.get(
        '/users/me',
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 401
    assert response.json()['detail'] == 'Could not validate credentials'

def test_invalid_token_access(client, registered_user):
    response = client.get(
        '/users/me',
        headers={'Authorization': "Bearer randomtoken123"}
    )
    assert response.status_code == 401
    assert response.json()['detail'] == 'Could not validate credentials'
    
    response = client.post(
        '/token',
        data={
            "username": registered_user["email"],
            "password": registered_user["password"]
        }
    )

    token = response.json()['access_token']

    # correct token, wrong token format
    response = client.get(
        '/users/me',
        headers={"Authorization": f"NotBearer {token}"}
    )

    response.status_code == 401


# Access to protected route using valid token
def test_read_users_me(client, registered_user):
    response = client.post(
        '/token',
        data={
            "username": registered_user['email'],
            "password": registered_user['password']
        }
    )
    assert response.status_code == 200 
    token = response.json()['access_token']

    response = client.get(
        '/users/me',
        headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 200
    user_data = response.json()

    assert user_data['email'] == registered_user['email']
    assert registered_user['password'] not in user_data
    assert user_data['is_active'] == True
    assert 'created_at' in user_data

# # Updating profile password
# def test_update_password(client, registered_user):
#     response = client.post(
#         '/token',
#         data={
#             "username": registered_user['email'],
#             "password": registered_user["password"]
#         }
#     )
#     assert response.status_code == 200
#     token = response.json()['access_token']

#     response = client.patch(
#         '/users/me',
#         json={
#             "user_update": {
#                 'current_password': registered_user['password'],
#                 'new_password': 'StrongPassword212!'
#             }
#         },
#         headers={"Authorization": f"Bearer {token}"}
#     )

#     print(f"{response.json()}")

#     assert response.status_code == 200

    # if response.status_code != 200:
    #     print(f"Error response: {response.json()}")

    # assert response.status_code == 200

    # response = client.post(
    #     '/token',
    #     data={
    #         'username': registered_user['email'],
    #         "password": 'StrongPassword212!'
    #     }
    # )

    # assert response.status_code == 200


