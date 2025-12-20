import type {Metadata, Viewport} from 'next';
import {GeistSans} from 'geist/font/sans';
import './globals.css';
import {Toaster} from 'sonner';
import React from "react";
import {BACKEND_ORIGIN} from "@/services/api";
import {siteConfig} from "@/lib/config";
import {size as ogSize} from './opengraph-image';

// This object handles SEO and content-related metadata.
export const metadata: Metadata = {
    // Primary Meta Tags
    title: {
        default: siteConfig.title,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: ['Roy Amit', 'developer', 'portfolio', 'full stack', 'python', 'fastapi', 'react', 'typescript', 'ai', 'chatbot'],
    authors: [{name: siteConfig.author, url: siteConfig.url}],
    creator: siteConfig.author,
    publisher: siteConfig.author,
    metadataBase: new URL(siteConfig.url),

    // Robots & Canonical URL
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: '/',
    },

    // Open Graph (for Facebook, LinkedIn, etc.)
    // Note: Images are automatically handled by app/opengraph-image.tsx
    openGraph: {
        type: 'website',
        url: siteConfig.url,
        title: siteConfig.title,
        description: siteConfig.description,
        siteName: siteConfig.name,
        locale: 'en_US',
        images: [
            {
                url: `${siteConfig.url}/opengraph-image`,
                width: ogSize.width,  // Reads 1200 from your file
                height: ogSize.height, // Reads 630 from your file
                alt: 'Roy Amit - Interactive Portfolio',
                type: 'image/png',
            },
        ],
    },

    // Twitter Card
    // Note: Images are automatically handled by app/twitter-image.tsx
    twitter: {
        card: 'summary_large_image',
        site: siteConfig.twitterHandle,
        creator: siteConfig.twitterHandle,
        title: siteConfig.title,
        description: siteConfig.description,
        images: [`${siteConfig.url}/opengraph-image`],
    },

    // Favicons
    icons: {
        icon: '/favicon.svg',
        apple: '/apple-touch-icon.png',
    },
};

// This new object handles viewport and browser chrome-related metadata.
export const viewport: Viewport = {
    themeColor: '#1E293B',
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={GeistSans.className}>
        <body>
        <link rel="preconnect" href={BACKEND_ORIGIN}/>
        <link rel="dns-prefetch" href={BACKEND_ORIGIN}/>
        {children}
        <Toaster position="top-right" richColors expand/>

        {/* JSON-LD Schema Markup */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@graph': [
                        // 1. Person/Organization Schema
                        {
                            '@type': 'Person',
                            '@id': `${siteConfig.url}/#person`,
                            name: siteConfig.author,
                            url: siteConfig.url,
                            jobTitle: 'Full-Stack Developer',
                            image: {
                                '@type': 'ImageObject',
                                url: `${siteConfig.url}${siteConfig.ogImage}`,
                            },
                            sameAs: [
                                siteConfig.links.github,
                                siteConfig.links.linkedin,
                                siteConfig.links.twitter,
                            ],
                            description: 'Full-Stack Developer specializing in React, Python, and AI-powered applications.',
                        },

                        // 2. WebSite Schema
                        {
                            '@type': 'WebSite',
                            '@id': `${siteConfig.url}/#website`,
                            url: siteConfig.url,
                            name: siteConfig.title,
                            description: siteConfig.description,
                            publisher: {
                                '@id': `${siteConfig.url}/#person`,
                            },
                            inLanguage: 'en-US',
                        },

                        // 3. WebPage Schema
                        {
                            '@type': 'WebPage',
                            '@id': `${siteConfig.url}/#webpage`,
                            url: siteConfig.url,
                            name: `Home - ${siteConfig.name} Portfolio`,
                            isPartOf: {
                                '@id': `${siteConfig.url}/#website`,
                            },
                            about: {
                                '@id': `${siteConfig.url}/#person`,
                            },
                            description: siteConfig.description,
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
