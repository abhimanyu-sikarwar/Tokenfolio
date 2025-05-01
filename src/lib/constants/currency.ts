import { SupportedCurrency } from "@/types/currency";


// Available time ranges for price history
export type TimeRange = '24h' | '7d' | '30d' | '90d' | '1y' | 'max';

export type SortOption =
    | 'market_cap_desc'
    | 'market_cap_asc'
    | 'volume_desc'
    | 'volume_asc'
    | 'id_desc'
    | 'id_asc'
    | 'gecko_desc'
    | 'gecko_asc';


// List of supported fiat currencies
export const SUPPORTED_CURRENCIES: SupportedCurrency[] = [
    'USD',
    'EUR',
    'GBP',
    'CHF',
    'INR'
];
export const supportedCurrencies = ['usd', 'eur', 'gbp', 'chf', 'inr'];

// Currency symbols for display
export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CHF: 'Fr',
    INR: '₹'
};

export const CACHE_DURATION = 300000;