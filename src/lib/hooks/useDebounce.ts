import { useState, useEffect } from 'react';

/**
 * Custom hook that debounces a value by delaying updates until after a specified delay
 * 
 * Useful for preventing excessive API calls during search input changes,
 * resizing events, or other frequently changing values.
 * 
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 500ms)
 * @returns The debounced value
 * 
 * @example
 * // In a search component
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 * 
 * // Effect will only run when debouncedSearchTerm changes
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     searchCryptocurrencies(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 * 
 * return (
 *   <Input
 *     value={searchTerm}
 *     onChange={(e) => setSearchTerm(e.target.value)}
 *     placeholder="Search cryptocurrencies..."
 *   />
 * );
 */
function useDebounce<T>(value: T, delay: number = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default useDebounce;