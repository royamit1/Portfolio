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
    // We use a relative path here so that Next.js can resolve it against metadataBase
    ogImage: "/og-image.png",
};

export type SiteConfig = typeof siteConfig;
