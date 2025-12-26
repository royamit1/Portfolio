/**
 * Get the base URL for the application.
 * Checks environment variables first, then defaults to localhost.
 */
export function getBaseUrl(): string {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
    }
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
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
