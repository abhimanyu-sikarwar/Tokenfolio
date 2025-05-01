import { RecentViewsContext } from '@/components/providers/RecentViewsProvider';
import { useContext } from 'react';

/**
 * Custom hook for accessing and manipulating the recently viewed cryptocurrencies
 * 
 * This hook provides convenient access to the RecentViewsContext without having to use
 * useContext directly in components.
 * 
 * @returns The recent views context with all methods and properties
 * 
 * @example
 * // In a component
 * const { recentlyViewed, addToRecentlyViewed } = useRecentViews();
 * 
 * // When user views a cryptocurrency detail
 * useEffect(() => {
 *   if (crypto) {
 *     addToRecentlyViewed(crypto);
 *   }
 * }, [crypto, addToRecentlyViewed]);
 * 
 * // Display recently viewed list
 * return (
 *   <div>
 *     <h2>Recently Viewed</h2>
 *     {recentlyViewed.length > 0 ? (
 *       <ul>
 *         {recentlyViewed.map(crypto => (
 *           <li key={crypto.id}>
 *             <Link to={`/currency/${crypto.id}`}>{crypto.name}</Link>
 *           </li>
 *         ))}
 *       </ul>
 *     ) : (
 *       <p>No recently viewed cryptocurrencies</p>
 *     )}
 *   </div>
 * );
 */
export function useRecentViews() {
    const context = useContext(RecentViewsContext);

    if (!context) {
        throw new Error('useRecentViews must be used within a RecentViewsProvider');
    }

    return context;
}

export default useRecentViews;