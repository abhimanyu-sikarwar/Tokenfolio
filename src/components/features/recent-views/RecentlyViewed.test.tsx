import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import RecentlyViewed from '@/components/features/recent-views/RecentlyViewed'
import { RecentViewsContext } from '@/components/providers/RecentViewsProvider'
import { CurrencyContext } from '@/components/providers/CurrencyProvider'

// Mock Next.js components
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />
}))

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: any) => <a href={href}>{children}</a>
}))

// Mock formatters
jest.mock('@/lib/utils/formatters', () => ({
    formatCurrency: (value: number) => `$${value}`
}))

describe('RecentlyViewed Component', () => {
    // Mock recently viewed cryptocurrencies
    const mockRecentlyViewed = [
        {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'BTC',
            image: 'https://example.com/bitcoin.png',
            currentPrice: 50000,
            priceChangePercentage24h: 2.5
        },
        {
            id: 'ethereum',
            name: 'Ethereum',
            symbol: 'ETH',
            image: 'https://example.com/ethereum.png',
            currentPrice: 3000,
            priceChangePercentage24h: -1.2
        }
    ]

    // Mock context values
    const mockRecentViewsContext = {
        recentlyViewed: mockRecentlyViewed,
        addToRecentlyViewed: jest.fn(),
        removeFromRecentlyViewed: jest.fn(),
        clearRecentlyViewed: jest.fn(),
        isRecentlyViewed: jest.fn()
    }

    const mockCurrencyContext:any = {
        currency: 'USD',
        setCurrency: jest.fn(),
        conversionRates: { USD: 1 },
        convertFromUSD: (value: number) => value,
        convert: jest.fn(),
        isLoading: false,
        error: null,
        refreshRates: jest.fn()
    }

    it('renders the list of recently viewed cryptocurrencies', () => {
        render(
            <CurrencyContext.Provider value={mockCurrencyContext}>
                <RecentViewsContext.Provider value={mockRecentViewsContext}>
                    <RecentlyViewed />
                </RecentViewsContext.Provider>
            </CurrencyContext.Provider>
        )

        // Check if the component title is rendered
        expect(screen.getByText('Recently Viewed')).toBeInTheDocument()

        // Check if both cryptocurrencies are rendered
        expect(screen.getByText('Bitcoin')).toBeInTheDocument()
        expect(screen.getByText('Ethereum')).toBeInTheDocument()

        // Check if symbols are displayed
        expect(screen.getByText('BTC')).toBeInTheDocument()
        expect(screen.getByText('ETH')).toBeInTheDocument()

        // Check if prices are displayed
        expect(screen.getByText('$50000')).toBeInTheDocument()
        expect(screen.getByText('$3000')).toBeInTheDocument()
    })

    it('shows correct price change styling', () => {
        render(
            <CurrencyContext.Provider value={mockCurrencyContext}>
                <RecentViewsContext.Provider value={mockRecentViewsContext}>
                    <RecentlyViewed />
                </RecentViewsContext.Provider>
            </CurrencyContext.Provider>
        )

        // Bitcoin has positive price change
        const positiveChange = screen.getByText('+2.50%')
        expect(positiveChange).toHaveClass('text-green-600')

        // Ethereum has negative price change
        const negativeChange = screen.getByText('-1.20%')
        expect(negativeChange).toHaveClass('text-red-600')
    })

    it('displays correct links to cryptocurrency details', () => {
        render(
            <CurrencyContext.Provider value={mockCurrencyContext}>
                <RecentViewsContext.Provider value={mockRecentViewsContext}>
                    <RecentlyViewed />
                </RecentViewsContext.Provider>
            </CurrencyContext.Provider>
        )

        // Find links and check their href attributes
        const links = screen.getAllByRole('link')

        // Find the Bitcoin link
        const bitcoinLink = links.find(link => link.textContent?.includes('Bitcoin'))
        expect(bitcoinLink).toHaveAttribute('href', '/currency/bitcoin')

        // Find the Ethereum link
        const ethereumLink = links.find(link => link.textContent?.includes('Ethereum'))
        expect(ethereumLink).toHaveAttribute('href', '/currency/ethereum')
    })

    it('shows empty state when no recently viewed cryptocurrencies', () => {
        const emptyContext = {
            ...mockRecentViewsContext,
            recentlyViewed: []
        }

        render(
            <CurrencyContext.Provider value={mockCurrencyContext}>
                <RecentViewsContext.Provider value={emptyContext}>
                    <RecentlyViewed />
                </RecentViewsContext.Provider>
            </CurrencyContext.Provider>
        )

        // Check if empty state message is displayed
        expect(screen.getByText('No recently viewed cryptocurrencies')).toBeInTheDocument()

        // Check for the explanatory text
        expect(screen.getByText('Cryptocurrencies you view will appear here.')).toBeInTheDocument()
    })

    it('renders cryptocurrency images when available', () => {
        render(
            <CurrencyContext.Provider value={mockCurrencyContext}>
                <RecentViewsContext.Provider value={mockRecentViewsContext}>
                    <RecentlyViewed />
                </RecentViewsContext.Provider>
            </CurrencyContext.Provider>
        )

        // Check if images are rendered with correct src
        const images = screen.getAllByRole('img')
        expect(images[0]).toHaveAttribute('src', 'https://example.com/bitcoin.png')
        expect(images[1]).toHaveAttribute('src', 'https://example.com/ethereum.png')
    })

    it('renders placeholder for missing images', () => {
        const contextWithMissingImage = {
            ...mockRecentViewsContext,
            recentlyViewed: [
                {
                    ...mockRecentlyViewed[0],
                    image: undefined
                },
                mockRecentlyViewed[1]
            ]
        }

        render(
            <CurrencyContext.Provider value={mockCurrencyContext}>
                <RecentViewsContext.Provider value={contextWithMissingImage}>
                    <RecentlyViewed />
                </RecentViewsContext.Provider>
            </CurrencyContext.Provider>
        )

        // Find the cryptocurrency with missing image
        const bitcoinItem = screen.getByText('Bitcoin').closest('li')

        // Check if a div placeholder is rendered instead of an image
        const placeholder = bitcoinItem?.querySelector('div.h-8.w-8')
        expect(placeholder).toBeInTheDocument()

        // The placeholder should contain the first letter of the symbol
        expect(bitcoinItem).toHaveTextContent('B')
    })
})