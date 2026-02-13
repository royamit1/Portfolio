// --- Single Source of Truth for API URL ---
// The full API endpoint (e.g., http://127.0.0.1:8000/api)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// The backend origin (e.g., http://127.0.0.1:8000) - useful for preconnect
export const BACKEND_ORIGIN = API_BASE_URL.replace('/api', '');

// Derived URLs
export const HEALTH_URL = API_BASE_URL.replace('/api', '/health');
