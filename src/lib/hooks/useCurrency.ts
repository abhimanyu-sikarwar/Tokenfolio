import { CurrencyContext } from '@/components/providers/CurrencyProvider';
import { useContext } from 'react';

/**
 * Custom hook for accessing and manipulating currency settings throughout the application
 * 
 * This hook provides convenient access to the CurrencyContext without having to use
 * useContext directly in components.
 * 
 * @returns The currency context with all methods and properties
 * 
 * @example
 * // In a component
 * const { currency, setCurrency, convertFromUSD } = useCurrency();
 * 
 * // Display a price in the user's preferred currency
 * const formattedPrice = formatCurrency(convertFromUSD(priceInUSD), currency);
 * 
 * // Allow user to change currency
 * <Dropdown 
 *   value={currency} 
 *   onChange={(value) => setCurrency(value as SupportedCurrency)}
 *   options={currencyOptions}
 * />
 */
export function useCurrency() {
    const context = useContext(CurrencyContext);

    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }

    return context;
}

export default useCurrency;