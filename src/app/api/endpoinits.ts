/**
 * API endpoints configuration
 * Centralizes all API endpoint paths in one place for easy management
 */

// Base API path
export const API_BASE_PATH = '/api';

/**
* CoinGecko API base URL
* This is used by our server-side API routes
*/
export const COINGECKO_BASE_URL= 'https://api.coingecko.com/api/v3'

// Cryptocurrency endpoints
export const ENDPOINTS = {
    /**
     * Endpoint for fetching a list of cryptocurrencies
     * 
     * Query parameters:
     * - currency: The currency to display prices in (default: 'usd')
     * - limit: Maximum number of cryptocurrencies to return (default: 50)
     * - page: Page number for pagination (default: 1)
     * - search: Optional search term to filter cryptocurrencies
     * - sort: Sort field (default: 'market_cap_rank')
     * - order: Sort order, 'asc' or 'desc' (default: 'asc')
     */
    CRYPTOCURRENCIES: `${API_BASE_PATH}/currencies`,

    /**
     * Endpoint for fetching details about a specific cryptocurrency
     * 
     * Path parameter:
     * - id: Cryptocurrency identifier
     * 
     * Query parameters:
     * - currency: The currency to display prices in (default: 'usd')
     */
    CRYPTOCURRENCY_DETAIL: (id: string) => `${API_BASE_PATH}/currency/${id}`,

    /**
     * Endpoint for currency conversion
     * 
     * Query parameters:
     * - amount: The amount to convert (number)
     * - from: Source currency code (string)
     * - to: Target currency code (string)
     */
    CONVERT: `${API_BASE_PATH}/convert`,
};

// External API configuration
export const EXTERNAL_API = {
    COINGECKO: {
        MARKETS: `${COINGECKO_BASE_URL}/coins/markets`,
        COIN_DETAIL: (id: string) => `${COINGECKO_BASE_URL}/coins/${id}`,
        SIMPLE_PRICE: `${COINGECKO_BASE_URL}/simple/price`,
        EXCHANGE_RATES: `${COINGECKO_BASE_URL}/exchange_rates`,
    },
};

/**
 * Build a full URL with query parameters
 * 
 * @param endpoint - The API endpoint
 * @param params - Query parameters as key-value pairs
 * @returns Complete URL with query parameters
 */
export function buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    const url = new URL(endpoint, window.location.origin);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, value.toString());
            }
        });
    }

    return url.toString();
}