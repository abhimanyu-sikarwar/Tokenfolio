import React from 'react';
import CurrencyCard from './CurrencyCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useCurrency } from '@/lib/hooks/useCurrency';
import { Cryptocurrency } from '@/types/currency';

interface CurrencyListProps {
    cryptocurrencies: Cryptocurrency[];
    isLoading: boolean;
    error: Error | null;
    onRetry?: () => void;
}

const CurrencyList: React.FC<CurrencyListProps> = ({
    cryptocurrencies,
    isLoading,
    error,
    onRetry,
}) => {
    const { currency } = useCurrency();
   

    if (isLoading) {
        return (
            <div className="w-full py-12 flex justify-center">
                <LoadingSpinner size="lg" text="Loading cryptocurrencies..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full py-8">
                <ErrorMessage
                    title="Failed to load cryptocurrencies"
                    message={error.message}
                    onRetry={onRetry}
                    showRetry={!!onRetry}
                />
            </div>
        );
    }

    if (cryptocurrencies.length === 0) {
        return (
            <div className="w-full py-8 text-center">
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
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No cryptocurrencies found
                </h3>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cryptocurrencies.map((crypto) => (
                <CurrencyCard
                    key={crypto.id}
                    crypto={crypto}
                    currency={currency}
                />
            ))}
        </div>
    );
};

export default CurrencyList;