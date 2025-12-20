// Helper to determine the base URL
// 1. NEXT_PUBLIC_APP_URL: Set this in your deployment environment to your actual domain (e.g., https://royamit.com).
// 2. VERCEL_URL: Automatically set by Vercel for preview/production deployments (doesn't include protocol).
// 3. Fallback: localhost for local development.
const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_APP_URL) {
        return process.env.NEXT_PUBLIC_APP_URL;
    }
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    return 'http://localhost:3000';
};

export const siteConfig = {
    name: 'Roy Amit',
    url: getBaseUrl(),
    title: 'Roy Amit | Full-Stack Developer',
    description: 'Explore the interactive portfolio of Roy Amit, a full-stack developer specializing in React, Python, and AI-powered applications.',
    author: 'Roy Amit',
    twitterHandle: '@royamit1',
    links: {
        twitter: 'https://twitter.com/royamit1',
        github: 'https://github.com/royamit1',
        linkedin: 'https://www.linkedin.com/in/royamit1/',
    },
    ogImage: '/opengraph-image', // Points to the generated dynamic image
};

export type SiteConfig = typeof siteConfig;
