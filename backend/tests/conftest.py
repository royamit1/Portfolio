import pytest
from unittest.mock import AsyncMock, MagicMock
from fastapi.testclient import TestClient
from app.main import app


# 1. Mock the heavy startup tasks and external dependencies
@pytest.fixture(autouse=True)
def mock_dependencies(mocker):
    """
    Automatically mocks external dependencies for ALL tests to ensure they run
    in an isolated environment without needing real API keys or database connections.
    """
    # Prevent main.py's lifespan handler from trying to connect to Postgres/OpenAI
    mocker.patch("app.main.ingest_data", new_callable=AsyncMock)

    # Prevent the rate limiter from using its real storage (e.g., Redis)
    # This effectively disables rate limiting for all tests.
    mocker.patch("app.core.limiter.limiter._storage", MagicMock())

    # Prevent any test from trying to make a real email connection
    mocker.patch("app.services.contact_service.fm", MagicMock())


# 2. Create a single, reusable TestClient for all tests
@pytest.fixture(scope="session")
def client():
    """
    Creates a TestClient instance that correctly handles the app's lifespan events.
    The scope is 'session' to create the client only once for the entire test run.
    """
    with TestClient(app) as c:
        yield c
