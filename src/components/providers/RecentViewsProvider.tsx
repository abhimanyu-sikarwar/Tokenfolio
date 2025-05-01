'use client';

import React, { createContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';

export interface CryptocurrencySummary {
    id: string;
    name: string;
    symbol: string;
    image?: string;
    currentPrice?: number;
    priceChangePercentage24h?: number;
}

// Interface for the context
interface RecentViewsContextType {
    recentlyViewed: CryptocurrencySummary[];
    addToRecentlyViewed: (crypto: CryptocurrencySummary) => void;
    removeFromRecentlyViewed: (id: string) => void;
    clearRecentlyViewed: () => void;
    isRecentlyViewed: (id: string) => boolean;
}

// Create the context with default values
export const RecentViewsContext = createContext<RecentViewsContextType>({
    recentlyViewed: [],
    addToRecentlyViewed: () => { },
    removeFromRecentlyViewed: () => { },
    clearRecentlyViewed: () => { },
    isRecentlyViewed: () => false,
});

interface RecentViewsProviderProps {
    children: ReactNode;
    maxItems?: number;
    storageKey?: string;
}

/**
 * RecentViewsProvider manages the history of recently viewed cryptocurrencies
 * 
 * Features:
 * - Tracks recently viewed cryptocurrencies
 * - Persists history in localStorage
 * - Limits the history to a configurable maximum number of items
 * - Provides utilities to add, remove, and check history
 */
export const RecentViewsProvider: React.FC<RecentViewsProviderProps> = ({
    children,
    maxItems = 10,
    storageKey = 'recentlyViewedCryptos',
}) => {
    // State for the recently viewed list
    const [recentlyViewed, setRecentlyViewed] = useState<CryptocurrencySummary[]>([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                setRecentlyViewed(JSON.parse(saved));
            }
        } catch (err) {
            console.error('Error loading recently viewed cryptocurrencies from localStorage:', err);
            localStorage.removeItem(storageKey);
        }
    }, [storageKey]);

    useEffect(() => {
        if (recentlyViewed.length > 0) {
            try {
                localStorage.setItem(storageKey, JSON.stringify(recentlyViewed));
            } catch (err) {
                console.error('Error saving recently viewed cryptocurrencies to localStorage:', err);
            }
        }
    }, [recentlyViewed, storageKey]);

    const addToRecentlyViewed = useCallback(
        (crypto: CryptocurrencySummary) => {
            setRecentlyViewed((prevList) => {
                const filteredList = prevList.filter((item) => item.id !== crypto.id);

                const newList = [crypto, ...filteredList];

                return newList.slice(0, maxItems);
            });
        },
        [maxItems]
    );

    const removeFromRecentlyViewed = useCallback((id: string) => {
        setRecentlyViewed((prevList) => prevList.filter((item) => item.id !== id));
    }, []);

    const clearRecentlyViewed = useCallback(() => {
        setRecentlyViewed([]);
    }, []);

    const isRecentlyViewed = useCallback(
        (id: string) => recentlyViewed.some((item) => item.id === id),
        [recentlyViewed]
    );

    const contextValue = useMemo(
        () => ({
            recentlyViewed,
            addToRecentlyViewed,
            removeFromRecentlyViewed,
            clearRecentlyViewed,
            isRecentlyViewed,
        }),
        [
            recentlyViewed,
            addToRecentlyViewed,
            removeFromRecentlyViewed,
            clearRecentlyViewed,
            isRecentlyViewed,
        ]
    );

    return (
        <RecentViewsContext.Provider value={contextValue}>
            {children}
        </RecentViewsContext.Provider>
    );
};

export default RecentViewsProvider;