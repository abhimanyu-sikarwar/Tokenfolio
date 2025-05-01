import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Input from '@/components/ui/Input';
import useDebounce from '@/lib/hooks/useDebounce';
import { useCurrency } from '@/lib/hooks/useCurrency';
import { formatCurrency } from '@/lib/utils/formatters';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { apiClient } from '@/app/api/client';

const SearchBar: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const debouncedQuery = useDebounce(query, 300);
    const { currency, convertFromUSD } = useCurrency();
    const router = useRouter();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const searchCryptocurrencies = async () => {
            if (debouncedQuery.length < 2) {
                setResults([]);
                setIsOpen(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);
                const data = await apiClient.searchCryptocurrencies(debouncedQuery, currency);
                setResults(data);
                setIsOpen(data.length > 0);
            } catch (err: any) {
                console.error('Search error:', err);
                setError(err);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        searchCryptocurrencies();
    }, [debouncedQuery, currency]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        if (e.target.value.length > 0) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    const handleSelect = (id: string) => {
        setQuery('');
        setIsOpen(false);
        router.push(`/currency/${id}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <Input
                id='crypto-search'
                placeholder="Search cryptocurrencies..."
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                startIcon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                }
                endIcon={isLoading ? <LoadingSpinner size="xs" /> : undefined}
                fullWidth
                clearable
                aria-label="Search cryptocurrencies"
                data-testid="crypto-search-input"
            />

            {/* Search results dropdown */}
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-80 rounded-md overflow-y-auto">
                    {error ? (
                        <div className="p-4">
                            <ErrorMessage
                                message="Failed to load search results"
                                severity="error"
                                compact
                            />
                        </div>
                    ) : results.length === 0 && !isLoading ? (
                        <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
                            No results found for "{debouncedQuery}"
                        </div>
                    ) : (
                        <ul role="listbox">
                            {results.map((crypto) => (
                                <li
                                    key={crypto.id}
                                    role="option"
                                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <Link
                                        href={`/currency/${crypto.id}`}
                                        onClick={() => handleSelect(crypto.id)}
                                        className="flex items-center p-3"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 mr-3">
                                            {crypto.image ? (
                                                <Image
                                                    src={crypto.image}
                                                    alt={crypto.name}
                                                    width={32}
                                                    height={32}
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                                    {crypto.symbol.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="flex justify-between">
                                                <div className="font-medium truncate text-white">{crypto.name}</div>
                                                <div className="ml-2 text-gray-900 dark:text-gray-100">
                                                    {formatCurrency(crypto.currentPrice, currency)}
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <div className="text-gray-500 dark:text-gray-400">
                                                    {crypto.symbol}
                                                </div>
                                                <div className={`ml-2 ${crypto.priceChangePercentage24h >= 0
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-red-600 dark:text-red-400'
                                                    }`}>
                                                    {crypto.priceChangePercentage24h >= 0 ? '+' : ''}
                                                    {crypto.priceChangePercentage24h?.toFixed(2)}%
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;