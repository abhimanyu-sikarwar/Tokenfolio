import { NextRequest, NextResponse } from "next/server";
import { EXTERNAL_API } from "../endpoinits";
import { Cryptocurrency, CryptocurrencyResponse } from "@/types/currency";
import { CACHE_DURATION, supportedCurrencies } from "@/lib/constants/currency";

// Cache configuration
interface CachedData {
    data: Cryptocurrency[];
    timestamp: number;
}

// In-memory cache object for different currencies and search queries
const cache: Record<string, CachedData> = {};

/**
 * API route handler for fetching a list of cryptocurrencies
 * 
 * Query parameters:
 * - currency: The currency to display prices in (default: 'usd')
 * - limit: Maximum number of cryptocurrencies to return (default: 50)
 * - page: Page number for pagination (default: 1)
 * - search: Optional search term to filter cryptocurrencies
 * - sort: Sort field (default: 'market_cap_rank')
 * - order: Sort order, 'asc' or 'desc' (default: 'asc')
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const currency = (searchParams.get("currency") || "usd").toLowerCase();
        const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
        const page = parseInt(searchParams.get("page") || "1");
        const search = searchParams.get("search") || "";
        const sort = searchParams.get("sort") || "market_cap_rank";
        const order = searchParams.get("order") || "asc";

        if (!supportedCurrencies.includes(currency)) {
            return NextResponse.json(
                { error: `Unsupported currency: ${currency}. Supported currencies are: ${supportedCurrencies.join(', ')}` },
                { status: 400 }
            );
        }

        const cacheKey = `${currency}-${limit}-${page}-${search}-${sort}-${order}`;

        const now = Date.now();
        if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
            return NextResponse.json(cache[cacheKey].data);
        }

        // Fetch data from CoinGecko API
        const apiUrl = new URL(EXTERNAL_API.COINGECKO.MARKETS);
        apiUrl.searchParams.append("vs_currency", currency);
        apiUrl.searchParams.append("per_page", limit.toString());
        apiUrl.searchParams.append("page", page.toString());
        apiUrl.searchParams.append("order", `${sort}_${order}`);
        apiUrl.searchParams.append("sparkline", "false");

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const rawData: CryptocurrencyResponse[] = await response.json();

        let cryptos: Cryptocurrency[] = rawData.map(crypto => ({
            id: crypto.id,
            symbol: crypto.symbol.toUpperCase(),
            name: crypto.name,
            image: crypto.image,
            currentPrice: crypto.current_price,
            marketCap: crypto.market_cap,
            marketCapRank: crypto.market_cap_rank,
            totalVolume: crypto.total_volume,
            priceChange24h: crypto.price_change_24h,
            priceChangePercentage24h: crypto.price_change_percentage_24h,
            circulatingSupply: crypto.circulating_supply,
            totalSupply: crypto.total_supply,
            maxSupply: crypto.max_supply,
            lastUpdated: crypto.last_updated
        }));

        if (search) {
            const searchLower = search.toLowerCase();
            cryptos = cryptos.filter(
                crypto =>
                    crypto.name.toLowerCase().includes(searchLower) ||
                    crypto.symbol.toLowerCase().includes(searchLower) ||
                    crypto.id.toLowerCase().includes(searchLower)
            );
        }

        cache[cacheKey] = {
            data: cryptos,
            timestamp: now
        };

        return NextResponse.json(cryptos);
    } catch (error) {
        console.error("Error fetching cryptocurrencies:", error);
        return NextResponse.json(
            { error: "Failed to fetch cryptocurrency data" },
            { status: 500 }
        );
    }
}
