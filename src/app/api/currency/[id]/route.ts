import { NextRequest, NextResponse } from "next/server";

import { EXTERNAL_API } from "../../endpoinits";
import { CACHE_DURATION, supportedCurrencies } from "@/lib/constants/currency";
import { cache, CryptocurrencyDetail, SimplifiedCryptocurrencyDetail } from "@/types/currency";

/**
 * API route handler for fetching detailed information about a specific cryptocurrency
 * 
 * Path parameter:
 * - id: Cryptocurrency identifier
 * 
 * Query parameters:
 * - currency: The currency to display prices in (default: 'usd')
 */
export async function GET(
    request: NextRequest,
    { params }: any
    // { params }: { params: { id: string } }
) {
    try {
        const id = params?.id;

        if (!id) {
            return NextResponse.json(
                { error: "Cryptocurrency ID is required" },
                { status: 400 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const currency = (searchParams.get("currency") || "usd").toLowerCase();

        if (!supportedCurrencies.includes(currency)) {
            return NextResponse.json(
                { error: `Unsupported currency: ${currency}. Supported currencies are: ${supportedCurrencies.join(', ')}` },
                { status: 400 }
            );
        }

        const cacheKey = `${id}-${currency}`;

        const now = Date.now();
        if (cache[cacheKey] && (now - cache[cacheKey].timestamp < CACHE_DURATION)) {
            return NextResponse.json(cache[cacheKey].data);
        }

        // Fetch data from CoinGecko API
        const apiUrl = `${EXTERNAL_API.COINGECKO.COIN_DETAIL(id)}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false&sparkline=false`;

        const response = await fetch(apiUrl);

        if (response.status === 404) {
            return NextResponse.json(
                { error: `Cryptocurrency with ID '${id}' not found` },
                { status: 404 }
            );
        }

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const rawData: CryptocurrencyDetail = await response.json();

        const simplifiedData: SimplifiedCryptocurrencyDetail = {
            id: rawData.id,
            symbol: rawData.symbol.toUpperCase(),
            name: rawData.name,
            images: rawData.image,
            description: rawData.description?.en || "",
            links: {
                homepage: Array.isArray(rawData.links.homepage) && rawData.links.homepage.length > 0
                    ? rawData.links.homepage[0]
                    : "",
                explorer: Array.isArray(rawData.links.blockchain_site) && rawData.links.blockchain_site.length > 0
                    ? rawData.links.blockchain_site[0]
                    : "",
                github: Array.isArray(rawData.links.repos_url.github) && rawData.links.repos_url.github.length > 0
                    ? rawData.links.repos_url.github[0]
                    : "",
                reddit: rawData.links.subreddit_url || "",
                twitter: "",
            },
            marketData: {
                currentPrice: rawData.market_data.current_price[currency] || 0,
                marketCap: rawData.market_data.market_cap[currency] || 0,
                marketCapRank: rawData.market_data.market_cap_rank || 0,
                fullyDilutedValuation: rawData.market_data.fully_diluted_valuation?.[currency] || null,
                totalVolume: rawData.market_data.total_volume[currency] || 0,
                high24h: rawData.market_data.high_24h[currency] || 0,
                low24h: rawData.market_data.low_24h[currency] || 0,
                priceChange24h: rawData.market_data.price_change_24h || 0,
                priceChangePercentage24h: rawData.market_data.price_change_percentage_24h || 0,
                priceChangePercentage7d: rawData.market_data.price_change_percentage_7d || 0,
                priceChangePercentage30d: rawData.market_data.price_change_percentage_30d || 0,
                priceChangePercentage1y: rawData.market_data.price_change_percentage_1y || 0,
                marketCapChange24h: rawData.market_data.market_cap_change_24h || 0,
                marketCapChangePercentage24h: rawData.market_data.market_cap_change_percentage_24h || 0,
                totalSupply: rawData.market_data.total_supply,
                maxSupply: rawData.market_data.max_supply,
                circulatingSupply: rawData.market_data.circulating_supply || 0,
                ath: rawData.market_data.ath[currency] || 0,
                athChangePercentage: rawData.market_data.ath_change_percentage[currency] || 0,
                athDate: rawData.market_data.ath_date[currency] || "",
                atl: rawData.market_data.atl[currency] || 0,
                atlChangePercentage: rawData.market_data.atl_change_percentage[currency] || 0,
                atlDate: rawData.market_data.atl_date[currency] || "",
            },
            exchanges: rawData.tickers
                .slice(0, 5)
                .map(ticker => ({
                    exchange: ticker.market.name,
                    pair: `${ticker.base}/${ticker.target}`,
                    lastPrice: ticker.last,
                    volume: ticker.volume,
                    trustScore: ticker.trust_score || "unknown"
                })),
            lastUpdated: rawData.last_updated,
        };

        cache[cacheKey] = {
            data: simplifiedData,
            timestamp: now
        };

        return NextResponse.json(simplifiedData);
    } catch (error) {
        console.error(`Error fetching cryptocurrency details:`, error);
        return NextResponse.json(
            { error: "Failed to fetch cryptocurrency details" },
            { status: 500 }
        );
    }
}
