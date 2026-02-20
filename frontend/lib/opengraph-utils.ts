/**
 * Get the base URL for the application.
 * Priority:
 * 1. NEXT_PUBLIC_APP_URL (explicit override)
 * 2. VERCEL_PROJECT_PRODUCTION_URL (always the production domain, even in preview deployments)
 * 3. localhost fallback for local development
 * 
 * NOTE: We intentionally do NOT use VERCEL_URL here because it points to 
 * preview deployment URLs which are protected by Vercel authentication,
 * making them inaccessible to social media crawlers.
 */
function getBaseUrl(): string {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
    }

    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
        return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
    }

    return "http://localhost:3000";
}

/**
 * Construct an absolute URL from a relative path.
 * @param path - Relative path (e.g., "/projects" or "/opengraph-image")
 * @returns Absolute URL (e.g., "https://royamit.com/projects")
 */
export function getAbsoluteUrl(path: string): string {
    const baseUrl = getBaseUrl();
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
}

/**
 * Default OpenGraph image path
 */
const DEFAULT_OG_IMAGE = "/og-image.png";

/**
 * Get the absolute URL for the default OpenGraph image
 */
export function getDefaultOgImageUrl(): string {
    return getAbsoluteUrl(DEFAULT_OG_IMAGE);
}
