import {getAbsoluteUrl} from "@/lib/opengraph-utils";

export const siteConfig = {
    name: 'Roy Amit',
    // We use the utility to get the absolute URL for the homepage
    url: getAbsoluteUrl("/"),
    title: 'Roy Amit | Full-Stack Developer',
    description: 'Chat with my personal AI assistant to explore my portfolio',
    author: 'Roy Amit',
    twitterHandle: '@royamit1',
    links: {
        twitter: 'https://twitter.com/royamit1',
        github: 'https://github.com/royamit1',
        linkedin: 'https://www.linkedin.com/in/royamit1/',
    },
    // Using the local image in public/og-image.png
    // We add ?v=1 to force social media platforms to clear their cache and fetch the new image
    ogImage: "/og-image.png?v=1",
};

export type SiteConfig = typeof siteConfig;
