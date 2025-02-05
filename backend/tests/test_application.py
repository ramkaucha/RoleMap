import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_db
from datetime import datetime
from unittest.mock import patch, MagicMock
from app.utils.email import send_verification_email
from fastapi_mail import FastMail, ConnectionConfig

EXAMPLE_APPLICATION = {
    "company": "XYZ company",
    "role": "Software Engineer",
    "status": "applied",
    "location": "Sydney",
    "link": "www.ramkaucha.com",
    "comments": "",
    "category": "Internship",
    "date_applied": "2024-12-22T23:43:24.435Z"
}

@pytest.fixture(autouse=True)
def mock_fastmail():
    async def mock_send(*args, **kwargs):
        return None
    
    mock_fm = MagicMock(spec=FastMail)
    mock_fm.send_message.side_effect = mock_send

    with patch('app.utils.email.FastMail', return_value=mock_fm):
        yield mock_fm

# @pytest.fixture(autouse=True)
# def mock_email_system():
#     async def mock_send_email(email: str, token: str):
#         return None

#     async def mock_fastmail_send(*args, **kwargs):
#         return None

#     with patch('app.utils.email.send_verification_email', side_effect=mock_send_email) as email_mock, \
#          patch('fastapi_mail.FastMail.send_message', side_effect=mock_fastmail_send) as fastmail_mock:
#         yield (email_mock, fastmail_mock)

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
    user_data = { "email": "test@example.com", "password": "StrongPassword123!@#", "first_name": "Bob", "last_name": "Kazumi"}
    response = client.post('/auth/register', json=user_data)
    assert response.status_code == 200

    token = response.json().get('verification_token')

    verify_response = client.get(f'/verify-email?token={token}')
    assert verify_response.status_code == 200
    return user_data

@pytest.fixture
def logged_in_user(client, registered_user):
    response = client.post(
        '/auth/token',
        data={
            "username": registered_user['email'],
            "password": registered_user['password']
        }
    )

    assert response.status_code == 200
    
    return response.json()

# application testing 
def test_create_application(client, logged_in_user):
    response = client.get(
        '/users/me',
        headers={"Authorization": f"Bearer {logged_in_user['access_token']}"}
    )
    assert response.status_code == 200

    user_data = response.json()

    response = client.post(
        '/applications',
        json={
            "application": EXAMPLE_APPLICATION,
            "current_user": user_data
        }
    )

    response.status_code == 200
    data = response.json()
    assert data['company'] == EXAMPLE_APPLICATION['company']
    assert data['role'] == EXAMPLE_APPLICATION['role']
    assert data['status'] == EXAMPLE_APPLICATION['status']
    assert data['link'] == EXAMPLE_APPLICATION['link']
    assert data['comments'] == EXAMPLE_APPLICATION['comments']
    assert data['category'] == EXAMPLE_APPLICATION['category']
    
    assert 'id' in data
    assert 'user_id' in data
    assert 'created_at' in data
    assert 'updated_at' in data

def test_duplicate_application(client, logged_in_user):
    response = client.get(
        '/users/me',
        headers={"Authorization": f"Bearer {logged_in_user['access_token']}"}
    )
    assert response.status_code == 200
    user_data = response.json()

    response = client.post(
        '/applications',
        json={
            "application": EXAMPLE_APPLICATION,
            "current_user": user_data
        }
    )
    response.status_code == 200

    response = client.post(
        '/applications',
        json={
            "application": EXAMPLE_APPLICATION,
            "current_user": user_data
        }
    )
    response.status_code == 409
    response.json()['detail'] == "Warning: You may have already applied for this role at this company"

def test_get_applications(client, logged_in_user):
    EXAMPLE_APPLICATIONS = [
        {
            "company": f"company {i}",
            "role": f"Software Engineer {i}",
            "status": "APPLIED",
            "location": f"Sydney {i}",
            "link": f"www.ramkaucha.com {i}",
            "comments": "",
            "category": f"Internship {i}",
            "date_applied": datetime.now().isoformat()
        } for i in range(60)
    ]

    response = client.get(
        '/users/me',
        headers={"Authorization": f"Bearer {logged_in_user['access_token']}"}
    )
    assert response.status_code == 200
    user_data = response.json()

    for app in EXAMPLE_APPLICATIONS:    
        response = client.post(
            '/applications',
            json={
                "application": app,
                "current_user": user_data
            },
            headers={"Authorization": f"Bearer {logged_in_user['access_token']}"}
        )
        assert response.status_code == 200
   
    response = client.get(
        '/applications',
        headers={"Authorization": f"Bearer {logged_in_user['access_token']}"}
    )
    assert response.status_code == 200
    data = response.json()

    # check pagination data
    assert len(data['items']) == 50
    assert data['total'] == 60
    assert data['has_more'] == True

    response = client.get(
        '/applications?skip=50',
        headers={"Authorization": f"Bearer {logged_in_user['access_token']}"}
    )
    assert response.status_code == 200
    data = response.json()

    assert len(data['items']) == 10
    assert data['total'] == 60
    assert data['has_more'] == False

# testing route '/applications/{id}
def test_get_single_application(client, logged_in_user):
    response = client.get(
        '/users/me',
        headers={"Authorization": f"Bearer {logged_in_user['access_token']}"}
    )
    assert response.status_code == 200
    user_data = response.json()

    response = client.post(
        '/applications',
        json={
            "application": EXAMPLE_APPLICATION,
            "current_user": user_data
        },
        headers={"Authorization": f"Bearer {logged_in_user['access_token']}"}
    )

    assert response.status_code == 200
    application_id = response.json()['id']

    response = client.get(
        f'/applications/{application_id}',
        headers={"Authorization": f"Bearer {logged_in_user['access_token']}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data['company'] == EXAMPLE_APPLICATION['company']
    assert data['role'] == EXAMPLE_APPLICATION['role']
    assert data['status'] == EXAMPLE_APPLICATION['status']
    assert data['link'] == EXAMPLE_APPLICATION['link']
    assert data['comments'] == EXAMPLE_APPLICATION['comments']
    assert data['category'] == EXAMPLE_APPLICATION['category']
    
# testing updating application
def test_update_application(client, logged_in_user):
    response = client.get(
        '/users/me',
        headers={"Authorization": f"Bearer {logged_in_user['access_token']}"}
    )
    assert response.status_code == 200
    user_data = response.json()

    response = client.post(
        '/applications',
        json={
            "application": EXAMPLE_APPLICATION,
            "current_user": user_data
        },
        headers={"Authorization": f"Bearer {logged_in_user['access_token']}"}
    )
    assert response.status_code == 200
    application_id = response.json()['id']

    EXAMPLE_APPLICATION['company'] = 'Another Company'

    # Updating now
    response = client.put(
        f'/applications/{application_id}',
        json=EXAMPLE_APPLICATION,
        headers={"Authorization": f"Bearer {logged_in_user['access_token']}"}
    )

    assert response.status_code == 200
    data = response.json()
    assert data['company'] == 'Another Company'

    # FETCHING
    response = client.get(
        f'/applications/{application_id}',
        headers={"Authorization": f"Bearer {logged_in_user['access_token']}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data['company'] == 'Another Company'
    assert data['company'] == EXAMPLE_APPLICATION['company']
    assert data['role'] == EXAMPLE_APPLICATION['role']
    assert data['status'] == EXAMPLE_APPLICATION['status']
    assert data['link'] == EXAMPLE_APPLICATION['link']
    assert data['comments'] == EXAMPLE_APPLICATION['comments']
    assert data['category'] == EXAMPLE_APPLICATION['category']

# testing deleting an application
def test_delete_application(client, logged_in_user):
    response = client.get(
        '/users/me',
        headers={"Authorization": f"Bearer {logged_in_user['access_token']}"}
    )
    assert response.status_code == 200
    user_data = response.json()

    response = client.post(
        '/applications',
        json={
            "application": EXAMPLE_APPLICATION,
            "current_user": user_data
        },
        headers={"Authorization": f"Bearer {logged_in_user['access_token']}"}
    )
    assert response.status_code == 200
    application_id = response.json()['id']

    # deleting
    response = client.delete(
        f'/applications/{application_id}',
        headers={"Authorization": f"Bearer {logged_in_user['access_token']}"}
    )

    assert response.status_code == 204

    response = client.get(
        f'/applications/{application_id}',
        headers={"Authorization": f"Bearer {logged_in_user['access_token']}"}
    )

    assert response.status_code == 404