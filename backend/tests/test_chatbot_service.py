from langchain_core.documents import Document
from app.services.chatbot_service import format_docs


def test_format_docs():
    """
    Tests the format_docs function to ensure it correctly formats a list of documents,
    including the 'Source' and 'Content' labels.
    """
    # 1. Arrange: Create a list of sample documents
    docs = [
        Document(page_content="This is the first document.", metadata={"source": "doc1.txt"}),
        Document(page_content="This is the second document.", metadata={"source": "doc2.pdf"}),
        Document(page_content="A document with no source.", metadata={}),
    ]

    # 2. Act: Call the function with the sample data
    formatted_string = format_docs(docs)

    # 3. Assert: Check if the output matches the new, correct format
    expected_string = (
        "Source: doc1.txt\nContent: This is the first document.\n\n"
        "Source: doc2.pdf\nContent: This is the second document.\n\n"
        "Source: unknown\nContent: A document with no source."
    )

    assert formatted_string == expected_string


def test_format_docs_empty_list():
    """
    Tests that the format_docs function returns an empty string for an empty list.
    """
    # 1. Arrange
    docs = []
    # 2. Act
    formatted_string = format_docs(docs)
    # 3. Assert
    assert formatted_string == ""
