from fastapi.testclient import TestClient


# --- 1. Health Check Tests ---
def test_read_root(client: TestClient):
    """
    Sanity Check: Ensures the app starts and the root endpoint returns 200.
    """
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Portfolio API is running!"}


# --- 2. Chat Endpoint Tests ---
def test_chat_endpoint_success(client: TestClient, mocker):
    """
    Happy Path: Tests that the chat endpoint handles a valid request 
    and streams back the agent's response correctly.
    """

    # Arrange: Mock the streaming agent response
    # We simulate a response coming in multiple chunks to verify streaming logic
    async def mock_stream_generator(message, session_id):
        yield "Hello "
        yield "from "
        yield "Test!"

    # Patch the service function used by the router
    mocker.patch("app.routers.chat.stream_agent_response", side_effect=mock_stream_generator)

    payload = {"message": "Hello AI", "session_id": "test_session"}

    # Act
    response = client.post("/api/chat", json=payload)

    # Assert
    assert response.status_code == 200
    # The client.post helper collects the stream into response.text automatically
    assert response.text == "Hello from Test!"


def test_chat_endpoint_input_too_long(client: TestClient):
    """
    Security Test: Tests that the endpoint rejects messages longer than 2000 chars.
    """
    # Arrange: Create a string of 2001 characters
    long_message = "A" * 2001
    payload = {"message": long_message, "session_id": "long_test"}

    # Act
    response = client.post("/api/chat", json=payload)

    # Assert
    assert response.status_code == 400
    assert "Input message is too long" in response.json()["detail"]


def test_chat_validation_error(client: TestClient):
    """
    Validation Test: Ensures Pydantic catches missing fields (empty JSON).
    """
    response = client.post("/api/chat", json={})
    assert response.status_code == 422  # Unprocessable Entity


# --- 3. Contact Endpoint Tests ---
def test_contact_endpoint_success(client: TestClient, mocker):
    """
    Happy Path: Tests that the contact form accepts valid data and queues the email.
    """
    # Arrange: We need to ensure the FastMail sender doesn't actually run
    # Note: We patch the 'send_message' method on the 'fm' instance inside contact_service
    mock_send = mocker.patch("app.services.contact_service.fm.send_message", return_value=True)

    payload = {
        "name": "Recruiter John",
        "email": "john@company.com",
        "message": "I want to hire you immediately."
    }

    # Act
    response = client.post("/api/contact", json=payload)

    # Assert
    assert response.status_code == 202
    assert response.json()["message"] == "Your message has been successfully queued for sending."
