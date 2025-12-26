import type {Metadata, Viewport} from 'next';
import {GeistSans} from 'geist/font/sans';
import './globals.css';
import {Toaster} from 'sonner';
import React from "react";
import {BACKEND_ORIGIN} from "@/services/api";
import {siteConfig} from "@/lib/config";
import {getAbsoluteUrl} from "@/lib/url-utils";

export const viewport: Viewport = {
    themeColor: '#1E293B',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
    const title = siteConfig.title;
    const description = siteConfig.description;
    const canonicalUrl = getAbsoluteUrl("/");
    const imageUrl = siteConfig.ogImage;

    return {
        title: {
            default: title,
            template: `%s | ${siteConfig.name}`,
        },
        description,
        metadataBase: new URL(canonicalUrl), // Fixes relative URL issues automatically
        authors: [{name: siteConfig.author, url: canonicalUrl}],
        creator: siteConfig.author,
        publisher: siteConfig.author,

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
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: siteConfig.description,
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
            images: [imageUrl],
        },

        // Icons
        icons: {
            icon: '/favicon.svg',
            apple: '/apple-touch-icon.png',
        },
    };
}

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

        {/* JSON-LD Schema can stay here or move to a separate component */}
        <script
            type="application/ld+json"
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
                                url: siteConfig.ogImage,
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
                    ],
                }),
            }}
        />
        </body>
        </html>
    );
}
