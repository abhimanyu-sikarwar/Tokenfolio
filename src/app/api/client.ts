import { Cryptocurrency, SimplifiedCryptocurrencyDetail, SupportedCurrency } from "@/types/currency";

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = '/api') {
        this.baseUrl = baseUrl;
    }

    private async fetchWithErrorHandling<T>(
        url: string,
        options: RequestInit = {}
    ): Promise<T> {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.error || `HTTP error ${response.status}`;
                throw new Error(errorMessage);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    /**
     * Fetch a list of cryptocurrencies
     * 
     * @param currency - The display currency
     * @param limit - Maximum number of results
     * @param page - Page number for pagination
     * @param search - Optional search term
     * @param sort - Field to sort by
     * @param order - Sort order ('asc' or 'desc')
     * @returns Promise resolving to an array of cryptocurrency objects
     */
    async getCryptocurrencies(
        currency: SupportedCurrency = 'USD',
        limit: number = 50,
        page: number = 1,
        search?: string,
        sort: string = 'market_cap_rank',
        order: 'asc' | 'desc' = 'asc'
    ): Promise<Cryptocurrency[]> {
        let urlString = `${this.baseUrl}/currencies`;

        const params = new URLSearchParams();
        params.append('currency', currency.toLowerCase());
        params.append('limit', limit.toString());
        params.append('page', page.toString());

        if (search) {
            params.append('search', search);
        }

        params.append('sort', sort);
        params.append('order', order);

        const fullUrl = `${urlString}?${params.toString()}`;

        return this.fetchWithErrorHandling<Cryptocurrency[]>(fullUrl);
    }

    /**
     * Fetch detailed information about a specific cryptocurrency
     * 
     * @param id - The cryptocurrency ID
     * @param currency - The display currency
     * @returns Promise resolving to a cryptocurrency detail object
     */
    async getCryptocurrencyDetail(
        id: string,
        currency: SupportedCurrency = 'USD'
    ): Promise<SimplifiedCryptocurrencyDetail> {
        let urlString = `${this.baseUrl}/currency/${id}`;

        const params = new URLSearchParams();
        params.append('currency', currency.toLowerCase());

        const fullUrl = `${urlString}?${params.toString()}`;

        return this.fetchWithErrorHandling<SimplifiedCryptocurrencyDetail>(fullUrl);
    }

    /**
     * Convert an amount from one currency to another
     * 
     * @param amount - The amount to convert
     * @param from - Source currency code
     * @param to - Target currency code
     * @returns Promise resolving to the conversion result
     */
    async convertCurrency(
        amount: number,
        from: string,
        to: string
    ): Promise<{
        from: { currency: string; amount: number };
        to: { currency: string; amount: number };
        rate: number;
        timestamp: number;
    }> {
        let urlString = `${this.baseUrl}/convert`;

        const params = new URLSearchParams();
        params.append('amount', amount.toString());
        params.append('from', from);
        params.append('to', to);

        const fullUrl = `${urlString}?${params.toString()}`;

        return this.fetchWithErrorHandling(fullUrl);
    }

    /**
     * Search for cryptocurrencies matching a query
     * 
     * @param query - The search query
     * @param currency - The display currency
     * @param limit - Maximum number of results
     * @returns Promise resolving to an array of cryptocurrency objects
     */
    async searchCryptocurrencies(
        query: string,
        currency: SupportedCurrency = 'USD',
        limit: number = 20
    ): Promise<Cryptocurrency[]> {
        return this.getCryptocurrencies(currency, limit, 1, query);
    }

    /**
     * Get the top cryptocurrencies by market cap
     * 
     * @param currency - The display currency
     * @param limit - Maximum number of results (default 50, max 100)
     * @returns Promise resolving to an array of cryptocurrency objects
     */
    async getTopCryptocurrencies(
        currency: SupportedCurrency = 'USD',
        limit: number = 50
    ): Promise<Cryptocurrency[]> {
        return this.getCryptocurrencies(
            currency,
            Math.min(limit, 100),
            1,
            undefined,
            'market_cap_rank',
            'asc'
        );
    }

    /**
     * Fetch market chart data for a cryptocurrency
     * 
     * @param id - Cryptocurrency ID
     * @param currency - Currency to display prices in
     * @param days - Number of days or time range
     * @returns Promise with price, market cap, and volume data
     */
    async getCryptocurrencyMarketChart(
        id: string,
        currency: SupportedCurrency = 'USD',
        days: string | number = '30'
    ): Promise<{
        prices: [number, number][];
        market_caps: [number, number][];
        total_volumes: [number, number][];
    }> {
        let urlString = `${this.baseUrl}/cryptocurrency/${id}/market_chart`;

        const params = new URLSearchParams();
        params.append('vs_currency', currency.toLowerCase());
        params.append('days', days.toString());

        const fullUrl = `${urlString}?${params.toString()}`;

        return this.fetchWithErrorHandling(fullUrl);
    }
}

export const apiClient = new ApiClient();

export default ApiClient;