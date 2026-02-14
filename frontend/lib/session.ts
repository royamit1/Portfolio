/**
 * Session ID Manager
 * Generates and manages a unique session ID for rate limiting purposes.
 * The session ID is stored in localStorage and persists across page reloads.
 */

const SESSION_ID_KEY = 'chat_session_id'; // Use same key as existing implementation

/**
 * Generates a unique session ID using crypto.randomUUID()
 * Falls back to a timestamp-based ID if crypto is not available
 */
function generateSessionId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    // Fallback for older browsers
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Gets the current session ID from localStorage, or creates a new one if it doesn't exist
 */
export function getSessionId(): string {
    if (typeof window === 'undefined') {
        // Server-side rendering - return empty string
        return '';
    }

    try {
        let sessionId = localStorage.getItem(SESSION_ID_KEY);

        if (!sessionId) {
            sessionId = generateSessionId();
            localStorage.setItem(SESSION_ID_KEY, sessionId);
        }

        return sessionId;
    } catch (error) {
        // localStorage access blocked (incognito mode, privacy settings, etc.)
        // Generate a temporary session ID that won't persist
        console.warn('localStorage access denied, using temporary session ID');
        return generateSessionId();
    }
}
