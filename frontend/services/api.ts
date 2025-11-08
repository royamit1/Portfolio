import {v4 as uuidv4} from 'uuid';

// The base URL of your FastAPI backend
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Manages the session ID for the chat.
 * Retrieves the session ID from localStorage or creates a new one.
 * @returns The session ID for the current user.
 */
export function getSessionId(): string {
    let sessionId = localStorage.getItem('chat_session_id');
    if (!sessionId) {
        sessionId = uuidv4(); // Generate a new unique ID
        localStorage.setItem('chat_session_id', sessionId);
    }
    return sessionId;
}

// Define the shape of the data we send to the backend
export interface ChatRequest {
    message: string;
    session_id: string;
}

// Define the shape of the data we receive from the backend
export interface ChatResponse {
    reply: string;
}

/**
 * Sends a message to the chatbot API and returns the reply.
 * @param request The chat message and session ID.
 * @returns A promise that resolves to the chatbot's reply.
 */
export async function sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        // If the server response is not OK (e.g., 4xx or 5xx error)
        if (!response.ok) {
            // Try to get a more detailed error message from the response body
            const errorData = await response.json().catch(() => ({detail: 'An unknown error occurred.'}));
            throw new Error(`API Error: ${response.status} - ${errorData.detail || 'Something went wrong'}`);
        }

        return await response.json();

    } catch (error) {
        console.error("Failed to send chat message:", error);
        // Re-throw the error so the calling component can handle it
        throw error;
    }
}