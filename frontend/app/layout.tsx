import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import React from "react";
import { BACKEND_ORIGIN } from "@/services/api";
import { siteConfig } from "@/lib/config";
import { PostHogProvider } from '@/components/providers/posthog-provider';
import { getAbsoluteUrl, getDefaultOgImageUrl } from "@/lib/opengraph-utils";

// 1. Separate Viewport export (Next.js 14+ standard)
export const viewport: Viewport = {
    themeColor: '#1E293B',
    width: 'device-width',
    initialScale: 1,
};

// 2. Use generateMetadata like Cooksmith
export async function generateMetadata(): Promise<Metadata> {
    const title = siteConfig.title;
    const description = siteConfig.description;
    const canonicalUrl = getAbsoluteUrl("/");

    return {
        title: {
            default: title,
            template: `%s | ${siteConfig.name}`,
        },
        description,
        metadataBase: new URL(canonicalUrl),
        authors: [{ name: siteConfig.author, url: canonicalUrl }],
        creator: siteConfig.author,
        publisher: siteConfig.author,
        keywords: ['portfolio', 'full-stack developer', 'AI chatbot', 'Next.js', 'Python', 'LangChain', 'React', 'Roy Amit'],
        robots: {
            index: true,
            follow: true,
        },

        // Canonical URL
        alternates: {
            canonical: canonicalUrl,
        },

        // Open Graph
        openGraph: {
            type: 'website',
            url: canonicalUrl,
            title,
            description,
            siteName: siteConfig.name,
            locale: 'en_US',
            images: [
                {
                    url: siteConfig.ogImage,
                    width: 1200,
                    height: 630,
                    alt: siteConfig.description,
                    type: 'image/png',
                },
            ],
        },

        // Twitter
        twitter: {
            card: 'summary_large_image',
            site: siteConfig.twitterHandle,
            creator: siteConfig.twitterHandle,
            title,
            description,
            images: [siteConfig.ogImage],
        },
        // Icons
        icons: {
            icon: '/favicon.svg',
            apple: '/apple-touch-icon.png',
        },
        manifest: '/manifest.json',
    };
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={GeistSans.className}>
            <head>
                <link rel="preconnect" href={BACKEND_ORIGIN} />
                <link rel="dns-prefetch" href={BACKEND_ORIGIN} />
            </head>
            <body>
                <PostHogProvider>
                    {children}
                </PostHogProvider>
                <Analytics />
                <Toaster position="top-right" richColors expand />

                {/* JSON-LD Schema */}
                <script
                    type="application/ld+json"
                    suppressHydrationWarning
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@graph': [
                                {
                                    '@type': 'Person',
                                    '@id': `${siteConfig.url}#person`,
                                    name: siteConfig.author,
                                    url: siteConfig.url,
                                    jobTitle: 'Full-Stack Developer',
                                    image: {
                                        '@type': 'ImageObject',
                                        url: getDefaultOgImageUrl(),
                                    },
                                    sameAs: [
                                        siteConfig.links.github,
                                        siteConfig.links.linkedin,
                                        siteConfig.links.twitter,
                                    ],
                                    description: siteConfig.description,
                                },
                                {
                                    '@type': 'WebSite',
                                    '@id': `${siteConfig.url}#website`,
                                    url: siteConfig.url,
                                    name: siteConfig.title,
                                    description: siteConfig.description,
                                    publisher: {
                                        '@id': `${siteConfig.url}#person`,
                                    },
                                    inLanguage: 'en-US',
                                },
                                {
                                    '@type': 'WebPage',
                                    '@id': `${siteConfig.url}#webpage`,
                                    url: siteConfig.url,
                                    name: siteConfig.title,
                                    description: siteConfig.description,
                                    isPartOf: {
                                        '@id': `${siteConfig.url}#website`,
                                    },
                                    about: {
                                        '@id': `${siteConfig.url}#person`,
                                    },
                                    inLanguage: 'en-US',
                                },
                            ],
                        }),
                    }}
                />
            </body>
        </html>
    );
}
