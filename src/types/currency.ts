


// detailed cryptocurrency data
export interface CryptocurrencyDetail {
    id: string;
    symbol: string;
    name: string;
    image: {
        thumb: string;
        small: string;
        large: string;
    };
    description: {
        en: string;
    };
    links: {
        homepage: string[];
        blockchain_site: string[];
        official_forum_url: string[];
        subreddit_url: string;
        repos_url: {
            github: string[];
            bitbucket: string[];
        };
    };
    market_data: {
        current_price: Record<string, number>;
        ath: Record<string, number>;
        ath_change_percentage: Record<string, number>;
        ath_date: Record<string, string>;
        atl: Record<string, number>;
        atl_change_percentage: Record<string, number>;
        atl_date: Record<string, string>;
        market_cap: Record<string, number>;
        market_cap_rank: number;
        fully_diluted_valuation: Record<string, number>;
        total_volume: Record<string, number>;
        high_24h: Record<string, number>;
        low_24h: Record<string, number>;
        price_change_24h: number;
        price_change_percentage_24h: number;
        price_change_percentage_7d: number;
        price_change_percentage_14d: number;
        price_change_percentage_30d: number;
        price_change_percentage_60d: number;
        price_change_percentage_200d: number;
        price_change_percentage_1y: number;
        market_cap_change_24h: number;
        market_cap_change_percentage_24h: number;
        total_supply: number | null;
        max_supply: number | null;
        circulating_supply: number;
    };
    tickers: Array<{
        base: string;
        target: string;
        market: {
            name: string;
            identifier: string;
        };
        last: number;
        volume: number;
        trust_score: string;
    }>;
    last_updated: string;
}

// simplified cryptocurrency details
export interface SimplifiedCryptocurrencyDetail {
    id: string;
    symbol: string;
    name: string;
    images: {
        thumb: string;
        small: string;
        large: string;
    };
    description: string;
    links: {
        homepage: string;
        explorer: string;
        github: string;
        reddit: string;
        twitter: string;
    };
    marketData: {
        currentPrice: number;
        marketCap: number;
        marketCapRank: number;
        fullyDilutedValuation: number | null;
        totalVolume: number;
        high24h: number;
        low24h: number;
        priceChange24h: number;
        priceChangePercentage24h: number;
        priceChangePercentage7d: number;
        priceChangePercentage30d: number;
        priceChangePercentage1y: number;
        marketCapChange24h: number;
        marketCapChangePercentage24h: number;
        totalSupply: number | null;
        maxSupply: number | null;
        circulatingSupply: number;
        ath: number;
        athChangePercentage: number;
        athDate: string;
        atl: number;
        atlChangePercentage: number;
        atlDate: string;
    };
    exchanges: Array<{
        exchange: string;
        pair: string;
        lastPrice: number;
        volume: number;
        trustScore: string;
    }>;
    lastUpdated: string;
}

// Cache configuration
export interface CachedData {
    data: SimplifiedCryptocurrencyDetail;
    timestamp: number;
}

// In-memory cache object for different cryptocurrency details in different currencies 
export const cache: Record<string, CachedData> = {};


export interface ExchangeData {
    exchange: string;
    pair: string;
    lastPrice: number;
    volume: number;
    trustScore: string;
}

export interface PriceHistoryData {
    timestamp: number;
    price: number;
}

// Define supported currencies
export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'CHF' | 'INR';


// cryptocurrency response
export interface CryptocurrencyResponse {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    fully_diluted_valuation: number | null;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    ath: number;
    ath_change_percentage: number;
    ath_date: string;
    atl: number;
    atl_change_percentage: number;
    atl_date: string;
    last_updated: string;
}

// our simplified cryptocurrency
export interface Cryptocurrency {
    id: string;
    symbol: string;
    name: string;
    image: string;
    currentPrice: number;
    marketCap: number;
    marketCapRank: number;
    totalVolume: number;
    priceChange24h: number;
    priceChangePercentage24h: number;
    circulatingSupply: number;
    totalSupply: number | null;
    maxSupply: number | null;
    lastUpdated: string;
}
