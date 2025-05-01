import { SupportedCurrency } from "@/types/currency";

/**
 * Formats a number as currency with the given currency code
 * 
 * @param value - The numeric value to format
 * @param currency - The currency code (USD, EUR, etc.)
 * @param options - Additional formatting options
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(1234.56, 'USD'); // "$1,234.56"
 * formatCurrency(1234.56, 'EUR'); // "€1,234.56"
 * formatCurrency(1234.56, 'USD', { maximumFractionDigits: 0 }); // "$1,235"
 */
export function formatCurrency(
    value: number,
    currency: SupportedCurrency = 'USD',
    options: Intl.NumberFormatOptions = {}
): string {
    const defaultOptions: Intl.NumberFormatOptions = {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };

    const formatOptions = { ...defaultOptions, ...options };

    if (Math.abs(value) > 0 && Math.abs(value) < 0.01) {
        formatOptions.minimumFractionDigits = 6;
        formatOptions.maximumFractionDigits = 6;
    }

    if (Math.abs(value) >= 1_000_000_000) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value / 1_000_000_000) + 'B';
    }

    if (Math.abs(value) >= 1_000_000) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value / 1_000_000) + 'M';
    }

    return new Intl.NumberFormat('en-US', formatOptions).format(value);
}

/**
 * Formats a percentage value
 * 
 * @param value - The numeric value to format as percentage (e.g., 0.05 for 5%)
 * @param options - Additional formatting options
 * @returns Formatted percentage string
 * 
 * @example
 * formatPercentage(0.0567); // "5.67%"
 * formatPercentage(-0.1234); // "-12.34%"
 * formatPercentage(0.0567, { signDisplay: 'always' }); // "+5.67%"
 */
export function formatPercentage(
    value: number,
    options: Intl.NumberFormatOptions = {}
): string {
    const defaultOptions: Intl.NumberFormatOptions = {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };

    const formatOptions = { ...defaultOptions, ...options };

    return new Intl.NumberFormat('en-US', formatOptions).format(value);
}

/**
 * Formats a large number with abbreviations (K, M, B, T)
 * 
 * @param value - The numeric value to format
 * @param options - Additional formatting options
 * @returns Formatted number string with appropriate abbreviation
 * 
 * @example
 * formatLargeNumber(1500); // "1.50K"
 * formatLargeNumber(1500000); // "1.50M"
 * formatLargeNumber(1500000000); // "1.50B"
 */
export function formatLargeNumber(
    value: number,
    options: Intl.NumberFormatOptions = {}
): string {
    const defaultOptions: Intl.NumberFormatOptions = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };

    const formatOptions = { ...defaultOptions, ...options };

    const suffixes = ['', 'K', 'M', 'B', 'T'];

    const suffixIndex = Math.floor(Math.log10(Math.abs(value)) / 3);

    if (suffixIndex === 0) {
        return new Intl.NumberFormat('en-US', formatOptions).format(value);
    }

    const scaledValue = value / Math.pow(10, suffixIndex * 3);

    return new Intl.NumberFormat('en-US', formatOptions).format(scaledValue) + suffixes[suffixIndex];
}

/**
 * Formats a date string to a localized format
 * 
 * @param dateString - The date string to format
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 * 
 * @example
 * formatDate('2023-05-15T14:30:00Z'); // "May 15, 2023"
 * formatDate('2023-05-15T14:30:00Z', { dateStyle: 'full' }); // "Monday, May 15, 2023"
 */
export function formatDate(
    dateString: string,
    options: Intl.DateTimeFormatOptions = {}
): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        dateStyle: 'medium',
    };

    const formatOptions = { ...defaultOptions, ...options };

    const date = new Date(dateString);

    return new Intl.DateTimeFormat('en-US', formatOptions).format(date);
}

/**
 * Shortens a wallet address or hash for display
 * 
 * @param address - The full address or hash
 * @param prefixLength - Number of characters to keep at the beginning
 * @param suffixLength - Number of characters to keep at the end
 * @returns Shortened address string
 * 
 * @example
 * shortenAddress('0x1234567890abcdef1234567890abcdef12345678'); // "0x123456...345678"
 */
export function shortenAddress(
    address: string,
    prefixLength: number = 6,
    suffixLength: number = 6
): string {
    if (!address) return '';
    if (address.length <= prefixLength + suffixLength) return address;

    const prefix = address.slice(0, prefixLength);
    const suffix = address.slice(-suffixLength);

    return `${prefix}...${suffix}`;
}

/**
 * Formats a number as compact rounded number
 * 
 * @param value - The numeric value to format
 * @returns Human-readable string
 * 
 * @example
 * formatCompactNumber(1234); // "1.2K"
 * formatCompactNumber(1200000); // "1.2M"
 */
export function formatCompactNumber(value: number): string {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1,
    }).format(value);
}