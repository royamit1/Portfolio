import pytest
from unittest.mock import MagicMock
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture(autouse=True)
def mock_dependencies(mocker):
    """
    Automatically mocks external dependencies for ALL tests.
    Prevents API calls to OpenAI, Postgres, Redis, and Email servers.
    """
    # 1. Block RAG Data Ingestion (Stops OpenAI 401 Errors)
    from unittest.mock import AsyncMock
    mocker.patch("app.main.ingest_data", new_callable=AsyncMock)

    # 2. Mock Rate Limiter Storage (Stops Redis connection errors)
    # We mock the storage specifically to bypass the connection check
    mocker.patch("app.core.limiter.limiter._storage", MagicMock())

    # 3. Mock Email Service (Stops Resend API calls)
    mocker.patch("resend.Emails.send", return_value={"id": "mock-email-id"})


@pytest.fixture(scope="session")
def client():
    """
    Creates a single reusable TestClient for the session.
    """
    with TestClient(app) as c:
        yield c
