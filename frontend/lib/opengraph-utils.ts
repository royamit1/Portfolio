/**
 * Get the base URL for the application.
 * Checks environment variables first, then defaults to localhost.
 */
export function getBaseUrl(): string {
    let url = "http://localhost:3000";

    if (process.env.NEXT_PUBLIC_APP_URL) {
        url = process.env.NEXT_PUBLIC_APP_URL;
    } else if (process.env.VERCEL_URL) {
        url = `https://${process.env.VERCEL_URL}`;
    }

    // Remove trailing slash if present to avoid double slashes when appending paths
    return url.endsWith('/') ? url.slice(0, -1) : url;
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
