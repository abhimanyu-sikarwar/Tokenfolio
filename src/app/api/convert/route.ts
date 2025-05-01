import { NextRequest, NextResponse } from "next/server";
import { EXTERNAL_API } from "../endpoinits";

// Supported currencies
const supportedFiatCurrencies = ['usd', 'eur', 'gbp', 'chf', 'inr'];

// In-memory cache for conversion rates
type RatesCache = {
    rates: Record<string, number>;
    timestamp: number;
};

// Cache conversion rates for 10 minutes
const CACHE_DURATION = 600000;
let ratesCache: RatesCache | null = null;

/**
 * API route for currency conversion
 * Converts between cryptocurrencies and fiat currencies
 * 
 * Query parameters:
 * - amount: number // The amount to convert
 * - from: string // Source currency code
 * - to: string // Target currency code (e.g., 'usd', 'eur', 'btc')
 * 
 * Example: /api/convert?amount=100&from=btc&to=usd
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const amount = searchParams.get("amount");
        const from = searchParams.get("from")?.toLowerCase();
        const to = searchParams.get("to")?.toLowerCase();

        if (!amount || !from || !to) {
            return NextResponse.json({ error: "Missing required parameters: amount, from, and to" }, { status: 400 });
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount)) {
            return NextResponse.json({ error: "Amount must be a valid number" }, { status: 400 });
        }

        const rates = await getConversionRates();

        // replace hyphens with spaces
        const normalizedFrom = normalizeCurrencyId(from);
        const normalizedTo = normalizeCurrencyId(to);

        const fromRate = rates[normalizedFrom];
        const toRate = rates[normalizedTo];

        if (typeof fromRate !== 'number') {
            return NextResponse.json({ error: `Currency not found: ${from}` }, { status: 404 });
        }

        if (typeof toRate !== 'number') {
            return NextResponse.json({ error: `Currency not found: ${to}` }, { status: 404 });
        }

        // convert to USD first, then to target currency
        const usdValue = fromRate === 0 ? 0 : numericAmount / fromRate;
        const convertedValue = usdValue * toRate;

        return NextResponse.json({
            from: {
                currency: from,
                amount: numericAmount
            },
            to: {
                currency: to,
                amount: convertedValue
            },
            rate: toRate / fromRate,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error("Conversion error:", error);
        return NextResponse.json({ error: "Failed to perform currency conversion" }, { status: 500 });
    }
}

/**
 * Fetches current conversion rates, using cached values if available and not expired
 */
async function getConversionRates(): Promise<Record<string, number>> {
    // Check if we have rates cached
    const now = Date.now();
    if (ratesCache && now - ratesCache.timestamp < CACHE_DURATION) {
        return ratesCache.rates;
    }

    try {
        // Fetch rates from CoinGecko API
        // This endpoint gets rates for top cryptocurrencies in supported fiat currencies
        const response = await fetch(
            `${EXTERNAL_API.COINGECKO.SIMPLE_PRICE}?ids=bitcoin,ethereum,ripple,cardano,solana,polkadot,dogecoin,avalanche,chainlink,uniswap&vs_currencies=${supportedFiatCurrencies.join(',')}`
        );

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Format the rates to have a flat structure like { 'bitcoin': 30000, 'usd': 1, ... }
        const rates: Record<string, number> = {};

        // Add supported fiat currencies with USD as base (1 USD = 1 USD)
        rates['usd'] = 1;

        // Add cryptocurrency rates as { bitcoin: { usd: 30000, eur: 27000 } }
        for (const [cryptoId, currencyRates] of Object.entries(data)) {
            if (typeof currencyRates === 'object' && currencyRates !== null && 'usd' in currencyRates) {
                const usdRate = (currencyRates as any).usd;
                if (typeof usdRate === 'number' && usdRate > 0) {
                    rates[cryptoId] = 1 / usdRate; 
                }
            }
        }

        // fetch fiat currency exchange rates
        const fiatResponse = await fetch(EXTERNAL_API.COINGECKO.EXCHANGE_RATES);

        if (fiatResponse.ok) {
            const fiatData = await fiatResponse.json();

            if (fiatData && fiatData.rates) {
                for (const currency of supportedFiatCurrencies) {
                    if (currency !== 'usd' && fiatData.rates[currency]) {
                        rates[currency] = 1 / fiatData.rates[currency].value;
                    }
                }
            }
        }

        ratesCache = {
            rates,
            timestamp: now
        };

        return rates;
    } catch (error) {
        console.error("Error fetching conversion rates:", error);

        if (ratesCache) {
            console.warn("Using expired rates cache as fallback");
            return ratesCache.rates;
        }

        throw error;
    }
}

/**
 * Normalizes a currency ID to match the format used in our rates object
 */
function normalizeCurrencyId(id: string): string {
    let normalized = id.toLowerCase();

    normalized = normalized.replace(/-/g, '');

    const specialCases: Record<string, string> = {
        'btc': 'bitcoin',
        'eth': 'ethereum',
        'xrp': 'ripple',
        'ada': 'cardano',
        'sol': 'solana',
        'dot': 'polkadot',
        'doge': 'dogecoin',
        'avax': 'avalanche',
        'link': 'chainlink',
        'uni': 'uniswap'
    };

    return specialCases[normalized] || normalized;
}