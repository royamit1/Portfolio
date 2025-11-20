from fastapi.testclient import TestClient


def test_read_main(client: TestClient):
    """
    Tests the root endpoint ("/") of the application using the client fixture.
    
    Args:
        client (TestClient): The TestClient instance provided by the conftest.py fixture.
    """
    # 1. Arrange & 2. Act: Send a GET request to the root endpoint
    response = client.get("/")

    # 3. Assert: Check the results
    assert response.status_code == 200
    assert response.json() == {"message": "Portfolio API is running!"}
