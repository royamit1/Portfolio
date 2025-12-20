export const siteConfig = {
    name: 'Roy Amit',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
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
