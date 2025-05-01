'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useCurrency } from '@/lib/hooks/useCurrency';
import { useRecentViews } from '@/lib/hooks/useRecentViews';
import { formatCurrency, formatPercentage, formatDate, formatLargeNumber } from '@/lib/utils/formatters';
import { apiClient } from '@/app/api/client';
import { SimplifiedCryptocurrencyDetail } from '@/types/currency';

export default function CurrencyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { currency } = useCurrency();
    const { addToRecentlyViewed } = useRecentViews();
    const [crypto, setCrypto] = useState<SimplifiedCryptocurrencyDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const id = params?.id as string;

    const fetchCryptocurrencyDetails = async () => {
        if (!id) return;

        try {
            setIsLoading(true);
            setError(null);
            const data = await apiClient.getCryptocurrencyDetail(id, currency);
            setCrypto(data);

            addToRecentlyViewed({
                id: data.id,
                name: data.name,
                symbol: data.symbol,
                image: data.images.small,
                currentPrice: data.marketData.currentPrice,
                priceChangePercentage24h: data.marketData.priceChangePercentage24h,
            });
        } catch (err: any) {
            console.error('Failed to fetch cryptocurrency details:', err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCryptocurrencyDetails();
    }, [id, currency]);

    const handleBack = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-16">
                <LoadingSpinner size="lg" text="Loading cryptocurrency data..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-8">
                <div className="mb-6">
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to list
                    </button>
                </div>
                <ErrorMessage
                    title="Failed to load cryptocurrency details"
                    message={error.message}
                    onRetry={fetchCryptocurrencyDetails}
                    showRetry
                />
            </div>
        );
    }

    if (!crypto) {
        return (
            <div className="py-8 text-center">
                <div className="mb-6">
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to list
                    </button>
                </div>
                <p className="text-gray-600 dark:text-gray-300">Cryptocurrency not found.</p>
            </div>
        );
    }

    const priceChangeColor =
        crypto.marketData.priceChangePercentage24h > 0
            ? 'text-green-600 dark:text-green-400'
            : crypto.marketData.priceChangePercentage24h < 0
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-600 dark:text-gray-400';

    const cleanDescription = crypto.description
        ? crypto.description
            .replace(/<a\b[^>]*>(.*?)<\/a>/gi, '$1') 
            .replace(/<\/?[^>]+(>|$)/g, '')
        : 'No description available.';

    return (
        <div className="space-y-6">
            <div>
                <button
                    onClick={handleBack}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to list
                </button>
            </div>

            <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center">
                    {/* Logo and name */}
                    <div className="flex items-center mb-4 sm:mb-0">
                        <div className="mr-4 flex-shrink-0">
                            {crypto.images.large ? (
                                <Image
                                    src={crypto.images.large}
                                    alt={crypto.name}
                                    width={64}
                                    height={64}
                                    className="rounded-full"
                                />
                            ) : (
                                <div className="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                    <span className="text-xl font-medium">{crypto.symbol.charAt(0)}</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {crypto.name}
                                <span className="ml-2 text-lg text-gray-500 dark:text-gray-400">
                                    {crypto.symbol}
                                </span>
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Rank #{crypto.marketData.marketCapRank || 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Price information */}
                    <div className="sm:ml-auto text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(crypto.marketData.currentPrice, currency)}
                        </div>
                        <div className={`text-sm font-medium ${priceChangeColor}`}>
                            {crypto.marketData.priceChangePercentage24h > 0 ? '+' : ''}
                            {formatPercentage(crypto.marketData.priceChangePercentage24h / 100)}
                            <span className="text-gray-500 dark:text-gray-400 ml-1">(24h)</span>
                        </div>
                    </div>
                </div>

                {/* External links */}
                <div className="mt-6 flex flex-wrap gap-3">
                    {crypto.links.homepage && (
                        <a
                            href={crypto.links.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                            </svg>
                            Website
                        </a>
                    )}
                    {crypto.links.explorer && (
                        <a
                            href={crypto.links.explorer}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v11.5A2.25 2.25 0 004.25 18h11.5A2.25 2.25 0 0018 15.75V4.25A2.25 2.25 0 0015.75 2H4.25zM3.5 4.25a.75.75 0 01.75-.75h11.5a.75.75 0 01.75.75v11.5a.75.75 0 01-.75.75H4.25a.75.75 0 01-.75-.75V4.25z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                            </svg>
                            Explorer
                        </a>
                    )}
                    {crypto.links.github && (
                        <a
                            href={crypto.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                            </svg>
                            GitHub
                        </a>
                    )}
                    {crypto.links.reddit && (
                        <a
                            href={crypto.links.reddit}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                            </svg>
                            Reddit
                        </a>
                    )}
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Price and market stats */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            {crypto.name} Price and Market Stats
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Market Cap</span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {formatCurrency(crypto.marketData.marketCap, currency)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">24h Trading Volume</span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {formatCurrency(crypto.marketData.totalVolume, currency)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Fully Diluted Valuation</span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {crypto.marketData.fullyDilutedValuation ?
                                            formatCurrency(crypto.marketData.fullyDilutedValuation, currency) :
                                            'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Circulating Supply</span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {formatLargeNumber(crypto.marketData.circulatingSupply)}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Total Supply</span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {crypto.marketData.totalSupply ?
                                            formatLargeNumber(crypto.marketData.totalSupply) :
                                            'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">Max Supply</span>
                                    <span className="text-gray-900 dark:text-white font-medium">
                                        {crypto.marketData.maxSupply ?
                                            formatLargeNumber(crypto.marketData.maxSupply) :
                                            '∞'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 dark:text-gray-400">All-Time High</span>
                                    <div className="text-right">
                                        <div className="text-gray-900 dark:text-white font-medium">
                                            {formatCurrency(crypto.marketData.ath, currency)}
                                        </div>
                                        <div className="text-xs text-red-500">
                                            {formatPercentage(crypto.marketData.athChangePercentage / 100)}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {crypto.marketData.athDate ?
                                                formatDate(crypto.marketData.athDate) :
                                                'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Description */}
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            About {crypto.name}
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {cleanDescription}
                        </p>
                    </Card>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    {/* Price changes */}
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Price Change
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">24h</span>
                                <span className={`font-medium ${crypto.marketData.priceChangePercentage24h >= 0
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {crypto.marketData.priceChangePercentage24h >= 0 ? '+' : ''}
                                    {formatPercentage(crypto.marketData.priceChangePercentage24h / 100)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">7d</span>
                                <span className={`font-medium ${crypto.marketData.priceChangePercentage7d >= 0
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {crypto.marketData.priceChangePercentage7d >= 0 ? '+' : ''}
                                    {formatPercentage(crypto.marketData.priceChangePercentage7d / 100)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500 dark:text-gray-400">30d</span>
                                <span className={`font-medium ${crypto.marketData.priceChangePercentage30d >= 0
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {crypto.marketData.priceChangePercentage30d >= 0 ? '+' : ''}
                                    {formatPercentage(crypto.marketData.priceChangePercentage30d / 100)}
                                </span>
                            </div>
                            {crypto.marketData.priceChangePercentage1y !== undefined && (
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 dark:text-gray-400">1y</span>
                                    <span className={`font-medium ${crypto.marketData.priceChangePercentage1y >= 0
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                        }`}>
                                        {crypto.marketData.priceChangePercentage1y >= 0 ? '+' : ''}
                                        {formatPercentage(crypto.marketData.priceChangePercentage1y / 100)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Exchange data */}
                    {crypto.exchanges && crypto.exchanges.length > 0 && (
                        <Card className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Top Exchanges
                            </h2>
                            <div className="space-y-4">
                                {crypto.exchanges.map((exchange, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {exchange.exchange}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {exchange.pair}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-gray-900 dark:text-white">
                                                {formatCurrency(exchange.lastPrice, currency)}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Vol: {formatLargeNumber(exchange.volume)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Last updated */}
                    <Card className="p-4 bg-gray-50 dark:bg-gray-800">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                Last updated: {formatDate(crypto.lastUpdated, {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                })}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}