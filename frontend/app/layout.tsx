import type {Metadata, Viewport} from 'next';
import {GeistSans} from 'geist/font/sans';
import './globals.css';
import {Toaster} from 'sonner';
import React from "react";
import {BACKEND_ORIGIN} from "@/services/api";

// This object handles SEO and content-related metadata.
export const metadata: Metadata = {
    // Primary Meta Tags
    title: 'Roy Amit | Full-Stack Developer',
    description: 'Explore the interactive portfolio of Roy Amit, a full-stack developer specializing in React, Python, and AI-powered applications.',
    keywords: ['Roy Amit', 'developer', 'portfolio', 'full stack', 'python', 'fastapi', 'react', 'typescript', 'ai', 'chatbot'],
    authors: [{name: 'Roy Amit', url: 'https://royamit.com'}],
    creator: 'Roy Amit',
    publisher: 'Roy Amit',

    // Robots & Canonical URL
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://royamit.com',
    },

    // Open Graph (for Facebook, LinkedIn, etc.)
    openGraph: {
        type: 'website',
        url: 'https://royamit.com/',
        title: 'Roy Amit | Interactive AI Portfolio',
        description: 'Explore projects, skills, and experience through a unique, conversational AI interface.',
        images: [
            {
                url: 'https://royamit.com/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Roy Amit - Interactive Portfolio',
            },
        ],
        locale: 'en_US',
    },

    // Twitter Card
    twitter: {
        card: 'summary_large_image',
        site: '@royamit1',
        creator: '@royamit1',
        title: 'Roy Amit | Interactive AI Portfolio',
        description: 'Explore projects, skills, and experience through a unique, conversational AI interface.',
        images: ['https://royamit.com/og-image.png'],
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
                        // Helps Google disambiguate YOU as the entity behind the site.
                        {
                            '@type': 'Person',
                            '@id': 'https://royamit.com/#person',
                            name: 'Roy Amit',
                            url: 'https://royamit.com',
                            jobTitle: 'Full-Stack Developer',
                            image: {
                                '@type': 'ImageObject',
                                url: 'https://royamit.com/og-image.png',
                            },
                            sameAs: [
                                'https://github.com/royamit1',
                                'https://www.linkedin.com/in/royamit1/',
                                // Add other social links here if you have them
                            ],
                            description: 'Full-Stack Developer specializing in React, Python, and AI-powered applications.',
                        },

                        // 2. WebSite Schema
                        // Helps search engines understand this is a searchable site (enables "Site Name" in search results).
                        {
                            '@type': 'WebSite',
                            '@id': 'https://royamit.com/#website',
                            url: 'https://royamit.com',
                            name: 'Roy Amit | Interactive AI Portfolio',
                            description: 'Explore the interactive portfolio of Roy Amit, a full-stack developer specializing in React, Python, and AI-powered applications.',
                            publisher: {
                                '@id': 'https://royamit.com/#person',
                            },
                            inLanguage: 'en-US',
                        },

                        // 3. WebPage Schema
                        // Describes the Homepage specifically and links it to the Person and Website.
                        {
                            '@type': 'WebPage',
                            '@id': 'https://royamit.com/#webpage',
                            url: 'https://royamit.com',
                            name: 'Home - Roy Amit Portfolio',
                            isPartOf: {
                                '@id': 'https://royamit.com/#website',
                            },
                            about: {
                                '@id': 'https://royamit.com/#person',
                            },
                            description: 'Welcome to the interactive portfolio of Roy Amit.',
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
