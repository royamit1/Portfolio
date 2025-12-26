import { getAbsoluteUrl } from "@/lib/url-utils";

export const siteConfig = {
  name: 'Roy Amit',
  // We use the utility to get the absolute URL for the homepage
  url: getAbsoluteUrl("/"), 
  title: 'Roy Amit | Full-Stack Developer',
  description: 'Explore the interactive portfolio of Roy Amit, a full-stack developer specializing in React, Python, and AI-powered applications.',
  author: 'Roy Amit',
  twitterHandle: '@royamit1',
  links: {
    twitter: 'https://twitter.com/royamit1',
    github: 'https://github.com/royamit1',
    linkedin: 'https://www.linkedin.com/in/royamit1/',
  },
  // START WITH THE BANANA (It works!)
  // If you ever want to switch back to dynamic generation, change this to: getAbsoluteUrl("/opengraph-image")
  ogImage: 'https://digitalfish.tv/wp-content/uploads/2019/04/Platano-HD-4-5.png', 
};

export type SiteConfig = typeof siteConfig;
