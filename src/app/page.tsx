'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/features/search/SearchBar';
import CurrencyList from '@/components/features/currency/CurrencyList';
import RecentlyViewed from '@/components/features/recent-views/RecentlyViewed';
import Card from '@/components/ui/Card';
// import { apiClient } from '@/lib/api/client';
import { useCurrency } from '@/lib/hooks/useCurrency';
import { apiClient } from './api/client';
// import { Cryptocurrency } from '@/lib/api/currencies/route';

/**
 * Home page component
 * Shows search, top cryptocurrencies list, and recently viewed list
 */
export default function HomePage() {
    const { currency } = useCurrency();
    const [cryptocurrencies, setCryptocurrencies] = useState<any[]>([]);
    // const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    // For avoiding hydration mismatch with time display
    const [currentTime, setCurrentTime] = useState<string>('');

    // Set time after component mounts to avoid hydration mismatch
    useEffect(() => {
        setCurrentTime(new Date().toLocaleTimeString());
        // Optional: Update time every minute
        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    // Fetch top cryptocurrencies
    const fetchCryptocurrencies = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data:any = await apiClient.getTopCryptocurrencies(currency);
            setCryptocurrencies(data);
        } catch (err: any) {
            console.error('Failed to fetch cryptocurrencies:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data on initial load and when currency changes
    useEffect(() => {
        fetchCryptocurrencies();
    }, [currency]);

    return (
        <div className="space-y-6">
            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main content - cryptocurrency list */}
                <div className="lg:col-span-3">
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Top Cryptocurrencies by Market Cap
                            </h2>
                        </div>
                        <CurrencyList
                            cryptocurrencies={cryptocurrencies}
                            isLoading={isLoading}
                            error={error}
                            onRetry={fetchCryptocurrencies}
                        />
                    </Card>
                </div>

                {/* Sidebar - recently viewed */}
                <div className="lg:col-span-1">
                    <RecentlyViewed />

                    {/* Additional information card */}
                    <Card className="mt-6 p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            About Market Data
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            All cryptocurrency prices are updated in real-time and denominated in {currency}.
                            Market capitalization rankings are based on CoinGecko data.
                        </p>
                        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            <p className="flex items-center">
                                <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                {/* Only show time after client-side hydration */}
                                Last updated: {currentTime}
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}