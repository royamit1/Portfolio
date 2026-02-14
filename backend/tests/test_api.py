from fastapi.testclient import TestClient
from app.core.config import settings


# --- 1. Health Check Tests ---

def test_read_root(client: TestClient):
    """
    Sanity Check: Ensures the app starts and the root endpoint returns 200
    with the correct docs link and app name.
    """
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "message": f"{settings.APP_NAME} is running",
        "docs": "/docs"
    }


# --- 2. Chat Endpoint Tests ---

def test_chat_endpoint_success(client: TestClient, mocker):
    """
    Happy Path: Tests that the chat endpoint handles a valid request
    and streams back the agent's response correctly.
    """

    async def mock_stream_generator(message, session_id):
        yield "Hello "
        yield "from "
        yield "Test!"

    mocker.patch("app.routers.chat.stream_agent_response", side_effect=mock_stream_generator)

    payload = {"message": "Hello AI", "session_id": "test_session"}
    response = client.post("/api/chat", json=payload)

    assert response.status_code == 200
    assert response.text == "Hello from Test!"


def test_chat_endpoint_input_too_long(client: TestClient):
    """
    Security Test: Tests that the endpoint rejects messages longer than MAX_INPUT_LENGTH.
    """
    long_message = "A" * 600
    payload = {"message": long_message, "session_id": "long_test"}
    response = client.post("/api/chat", json=payload)

    assert response.status_code == 400
    assert "Message too long" in response.json()["detail"]


def test_chat_validation_error(client: TestClient):
    """
    Validation Test: Ensures Pydantic catches missing fields (empty JSON).
    """
    response = client.post("/api/chat", json={})
    assert response.status_code == 422


# --- 3. Contact Endpoint Tests ---

def test_contact_endpoint_success(client: TestClient, mocker):
    """
    Happy Path: Tests that the contact form accepts valid data and queues the email.
    """
    mocker.patch("resend.Emails.send", return_value={"id": "mock-email-id"})

    payload = {
        "name": "Recruiter John",
        "email": "john@company.com",
        "message": "I want to hire you immediately."
    }
    response = client.post("/api/contact", json=payload)

    assert response.status_code == 202
    assert response.json()["message"] == "Message received and queued for delivery."


def test_contact_invalid_email(client: TestClient):
    """
    Edge Case: Tests that the API strictly validates email formats.
    """
    payload = {
        "name": "Hacker",
        "email": "not-a-valid-email",  # ❌ Malformed email
        "message": "Testing validation"
    }
    response = client.post("/api/contact", json=payload)

    assert response.status_code == 422
    # Ensure the error is specifically about the email field
    errors = response.json()["detail"]
    assert any(error["loc"] == ["body", "email"] for error in errors)


def test_contact_service_failure(client: TestClient, mocker):
    """
    Sad Path: Tests how the API behaves when the service fails to queue the email.
    It should catch the internal error and return a clean 500 response.
    """
    # Simulate a generic email service error
    mocker.patch(
        "app.routers.contact.send_contact_form_email",
        side_effect=Exception("Simulated Queue Error")
    )

    payload = {
        "name": "Test User",
        "email": "test@example.com",
        "message": "This should fail gracefully."
    }
    response = client.post("/api/contact", json=payload)

    assert response.status_code == 500
    assert response.json()["detail"] == "Internal server error processing contact request."


# --- 4. Infrastructure & Security Tests ---

def test_cors_preflight(client: TestClient):
    """
    Infrastructure: Verifies that CORS headers are correctly set for frontend requests.
    Critical for React/Vite integration.
    """
    # Simulate a browser 'Preflight' check from your local frontend
    headers = {
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST"
    }

    # Check OPTIONS on any protected route
    response = client.options("/api/chat", headers=headers)

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
    assert "POST" in response.headers["access-control-allow-methods"]


def test_health_check(client: TestClient):
    """
    Health endpoint used by Render's uptime monitor and load balancers.
    """
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_health_check_head(client: TestClient):
    """
    HEAD method support for lightweight health probes (no response body).
    """
    response = client.head("/health")
    assert response.status_code == 200


# --- 5. Contact Edge Cases ---

def test_contact_message_too_short(client: TestClient):
    """
    Validation: Rejects messages under the 10-character minimum.
    """
    payload = {"name": "Test", "email": "test@test.com", "message": "Hi"}
    response = client.post("/api/contact", json=payload)
    assert response.status_code == 422


def test_contact_missing_fields(client: TestClient):
    """
    Validation: Rejects completely empty payloads.
    """
    response = client.post("/api/contact", json={})
    assert response.status_code == 422

