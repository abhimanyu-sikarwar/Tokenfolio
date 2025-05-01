import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import CurrencyProvider from '@/components/providers/CurrencyProvider';
import RecentViewsProvider from '@/components/providers/RecentViewsProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '../styles/globals.css';

// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] });

// Application metadata
export const metadata: Metadata = {
    title: 'CryptoTracker - Top Cryptocurrencies and Real-time Data',
    description: 'Track real-time prices, market caps, and more for the top cryptocurrencies.',
    keywords: 'cryptocurrency, bitcoin, ethereum, blockchain, crypto prices, market cap',
};

/**
 * Root layout component that wraps all pages
 * Includes global providers and layout elements
 */
export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html>
            {/* <html>
                <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
            </html> */}
            <body className={inter.className}>
                <CurrencyProvider>
                    <RecentViewsProvider>
                        <div className="flex flex-col min-h-screen">
                            <Header />
                            <main className="flex-grow mx-auto w-full  px-4 sm:px-6 lg:px-8 py-6">
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </RecentViewsProvider>
                </CurrencyProvider>
            </body>
        </html>
    );
}