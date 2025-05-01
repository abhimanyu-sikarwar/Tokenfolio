import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import { useRecentViews } from '@/lib/hooks/useRecentViews';
import { useCurrency } from '@/lib/hooks/useCurrency';
import { formatCurrency } from '@/lib/utils/formatters';

const RecentlyViewed: React.FC = () => {
    const { recentlyViewed } = useRecentViews();
    const { currency } = useCurrency();

    if (recentlyViewed.length === 0) {
        return (
            <Card className="w-full p-4">
                <div className="text-center py-6">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                        No recently viewed cryptocurrencies
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Cryptocurrencies you view will appear here.
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="w-full p-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recently Viewed</h2>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentlyViewed.map((crypto) => (
                    <li key={crypto.id}>
                        <Link
                            href={`/currency/${crypto.id}`}
                            className="block hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            <div className="flex items-center p-4">
                                {/* Cryptocurrency icon */}
                                <div className="flex-shrink-0 mr-3">
                                    {crypto.image ? (
                                        <Image
                                            src={crypto.image}
                                            alt={crypto.name}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium">
                                                {crypto.symbol && crypto.symbol.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Cryptocurrency details */}
                                <div className="flex flex-grow justify-between items-center min-w-0">
                                    <div className="truncate">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {crypto.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {crypto.symbol}
                                        </p>
                                    </div>

                                    {/* Show price if available */}
                                    {crypto.currentPrice !== undefined && (
                                        <div className="ml-3 text-right">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(crypto.currentPrice, currency)}
                                            </p>
                                            {crypto.priceChangePercentage24h !== undefined && (
                                                <p className={`text-xs ${crypto.priceChangePercentage24h >= 0
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-red-600 dark:text-red-400'
                                                    }`}>
                                                    {crypto.priceChangePercentage24h >= 0 ? '+' : ''}
                                                    {crypto.priceChangePercentage24h.toFixed(2)}%
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </Card>
    );
};

export default RecentlyViewed;