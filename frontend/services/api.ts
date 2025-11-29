import {v4 as uuidv4} from 'uuid';

// The base URL of your FastAPI backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
export const HEALTH_URL = API_BASE_URL.replace('/api', '/health');

/**
 * Manages the session ID for the chat.
 */
export function getSessionId(): string {
    if (typeof window === 'undefined') return uuidv4(); // Server-side fallback

    let sessionId = localStorage.getItem('chat_session_id');
    if (!sessionId) {
        sessionId = uuidv4();
        localStorage.setItem('chat_session_id', sessionId);
    }
    return sessionId;
}
