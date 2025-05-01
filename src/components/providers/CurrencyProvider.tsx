'use client';
import { SupportedCurrency } from '@/types/currency';
import React, { createContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

// Interface for currency conversion rates
interface ConversionRates {
    [key: string]: number; // Maps from currency code to conversion rate
}

// Interface for the currency context
interface CurrencyContextType {
    currency: SupportedCurrency;
    setCurrency: (currency: SupportedCurrency) => void;
    conversionRates: ConversionRates;
    convertFromUSD: (valueInUSD: number) => number;
    convert: (value: number, from: SupportedCurrency, to: SupportedCurrency) => number;
    isLoading: boolean;
    error: Error | null;
    refreshRates: () => Promise<void>;
}

// Create the context with default values
export const CurrencyContext = createContext<CurrencyContextType>({
    currency: 'USD',
    setCurrency: () => { },
    conversionRates: { USD: 1 },
    convertFromUSD: (value) => value,
    convert: (value) => value,
    isLoading: false,
    error: null,
    refreshRates: async () => { },
});

interface CurrencyProviderProps {
    children: ReactNode;
    defaultCurrency?: SupportedCurrency;
    fetchRates?: () => Promise<ConversionRates>;
}

/**
 * CurrencyProvider manages the global currency state and conversion functionality
 * 
 * Features:
 * - Stores and persists user's preferred currency
 * - Fetches and caches currency conversion rates
 * - Provides utility functions for currency conversion
 * - Handles loading and error states for rate fetching
 */
export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
    children,
    defaultCurrency = 'USD',
    fetchRates,
}) => {
    // States for the selected currency
    const [currency, setCurrency] = useState<SupportedCurrency>(defaultCurrency);

    // States for conversion rates
    const [conversionRates, setConversionRates] = useState<ConversionRates>({ USD: 1 });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [lastUpdated, setLastUpdated] = useState<number>(0);

    useEffect(() => {
        try {
            const savedCurrency = localStorage.getItem('preferredCurrency');
            if (savedCurrency && ['USD', 'EUR', 'GBP', 'CHF', 'INR'].includes(savedCurrency)) {
                setCurrency(savedCurrency as SupportedCurrency);
            }
        } catch (error) {
            console.error('Error reading currency from localStorage:', error);
        }
    }, []);

    const defaultFetchRates = async (): Promise<ConversionRates> => {
        try {
            return {
                USD: 1,
                EUR: 0.93,
                GBP: 0.79,
                CHF: 0.91,
                INR: 83.12
            };
        } catch (error) {
            throw new Error('Failed to fetch conversion rates');
        }
    };

    const refreshRates = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const rates = await (fetchRates || defaultFetchRates)();
            setConversionRates(rates);
            setLastUpdated(Date.now());
        } catch (err) {
            console.error('Error fetching conversion rates:', err);
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
            setIsLoading(false);
        }
    }, [fetchRates]);

    useEffect(() => {
        const shouldRefresh = Date.now() - lastUpdated > 60 * 60 * 1000;
        if (shouldRefresh) {
            refreshRates();
        }
    }, [refreshRates, lastUpdated]);

    useEffect(() => {
        try {
            localStorage.setItem('preferredCurrency', currency);
        } catch (error) {
            console.error('Error saving currency to localStorage:', error);
        }
    }, [currency]);

    const convertFromUSD = useCallback(
        (valueInUSD: number): number => {
            const rate = conversionRates[currency] || 1;
            return valueInUSD * rate;
        },
        [currency, conversionRates]
    );

    const convert = useCallback(
        (value: number, from: SupportedCurrency, to: SupportedCurrency): number => {
            if (!conversionRates[from] || !conversionRates[to]) {
                return value;
            }

            const valueInUSD = value / conversionRates[from];
            return valueInUSD * conversionRates[to];
        },
        [conversionRates]
    );

    const contextValue = useMemo(
        () => ({
            currency,
            setCurrency,
            conversionRates,
            convertFromUSD,
            convert,
            isLoading,
            error,
            refreshRates,
        }),
        [
            currency,
            setCurrency,
            conversionRates,
            convertFromUSD,
            convert,
            isLoading,
            error,
            refreshRates,
        ]
    );

    return (
        <CurrencyContext.Provider value={contextValue}>
            {children}
        </CurrencyContext.Provider>
    );
};

export default CurrencyProvider;