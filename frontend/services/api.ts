import { v4 as uuidv4 } from 'uuid';

// --- Single Source of Truth for API URL ---
// The full API endpoint (e.g., http://127.0.0.1:8000/api)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// The backend origin (e.g., http://127.0.0.1:8000) - useful for preconnect
export const BACKEND_ORIGIN = API_BASE_URL.replace('/api', '');

// Derived URLs
export const HEALTH_URL = API_BASE_URL.replace('/api', '/health');

export const getSessionId = (): string => {
    let sessionId = localStorage.getItem('chat_session_id');
    if (!sessionId) {
        sessionId = uuidv4();
        localStorage.setItem('chat_session_id', sessionId);
    }
    return sessionId;
};
