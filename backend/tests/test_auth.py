import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_db
import time
from unittest.mock import patch
from fastapi_mail import FastMail

@pytest.fixture(autouse=True)
def mock_email_config():
    test_config = {
        "MAIL_USERNAME": "test",
        "MAIL_PASSWORD": "test",
        "MAIL_FROM": "test@example.com",
        "MAIL_PORT": 587,
        "MAIL_SERVER": "smtp.test.com",
        "MAIL_STARTTLS": True, 
        "MAIL_SSL_TLS": False,
        "USE_CREDENTIALS": True,
        "VALIDATE_CERTS": True
    }

    with patch('app.utils.email.ConnectionConfig', return_value=test_config) as mock:
        yield mock

@pytest.fixture(autouse=True)
def mock_email_system():
    async def mock_send_email(email: str, token: str):
        return None
    
    async def mock_fastmail_send(*args, **kwargs):
        return None
    
    with patch('app.utils.email.send_verification_email', side_effect=mock_send_email) as email_mock, \
        patch('fastapi_mail.FastMail.send_message', side_effect=mock_fastmail_send) as fastmai_mock:
        yield (email_mock, fastmai_mock)

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
    
    token = response.json().get('verification_token')

    verify_response = client.get(f'/verify-email?token={token}')
    assert verify_response.status_code == 200

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
def test_update_password(client, registered_user):
    response = client.post(
        '/token',
        data={
            "username": registered_user['email'],
            "password": registered_user["password"]
        }
    )
    assert response.status_code == 200
    token = response.json()['access_token']

    new_password = 'StrongPassword212!'

    response = client.patch(
        '/users/me/profile',
        json={
            'current_password': registered_user['password'],
            'new_password': new_password
        },
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
    )

    assert response.status_code == 200

    response = client.post(
        '/token',
        data={
            'username': registered_user['email'],
            'password': registered_user["password"]
        }
    )

    assert response.status_code != 200

    response = client.post(
        '/token',
        data={
            'username': registered_user['email'],
            'password': new_password
        }
    )

    assert response.status_code == 200

# Updating profile first name and last name.
def test_update_profile(client, registered_user):
    response = client.post(
        '/token',
        data={
            "username": registered_user['email'],
            "password": registered_user['password']
        }
    )

    assert response.status_code == 200
    token = response.json()['access_token']

    new_first_name = 'newfirst'
    new_last_name = 'newlast'

    response = client.patch(
        '/users/me/profile',
        json={
            'first_name': new_first_name,
            'last_name': new_last_name
        },
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200
    user_data = response.json()

    assert user_data['user']['first_name'] == new_first_name
    assert user_data['user']['last_name'] == new_last_name

def test_update_profile_picture(client, registered_user):
    response = client.post(
        '/token',
        data={
            "username": registered_user['email'],
            "password": registered_user['password']
        }
    )

    assert response.status_code == 200
    token = response.json()['access_token']

    test_image = 'tests/assets/example-profile.jpg'

    with open(test_image, "rb") as f:
        files = {
            "profile_picture": ("example-profile.jpg", f, "image/jpeg")
        }
        response = client.patch(
            '/users/me/profile-picture',
            files=files,
            headers={
                "Authorization": f"Bearer {token}"
            }
        )
    
    assert response.status_code == 200
    assert response.json()["message"] == "Profile update successfully"
    assert response.json()["user"]["profile_picture"] is not None