import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import CurrencyCard from '@/components/features/currency/CurrencyCard'

// Mock necessary dependencies
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />
}))

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: any) => <a href={href}>{children}</a>
}))

jest.mock('@/lib/utils/formatters', () => ({
    formatLargeNumber: (value: number) => `${value}`,
    formatCurrency: (value: number) => `$${value}`,
    formatPercentage: (value: number) => `${value * 100}%`
}))

describe('CurrencyCard Component', () => {
    const mockCrypto:any = {
        id: 'bitcoin',
        name: 'Bitcoin',
        symbol: 'BTC',
        image: 'https://example.com/bitcoin.png',
        currentPrice: 50000,
        priceChangePercentage24h: 2.5,
        marketCap: 1000000000000,
        circulatingSupply: 1000000000000,
        maxSupply: 1000000000000,
        marketCapRank: 1,
        totalVolume: 30000000000
    }

    it('renders cryptocurrency information correctly', () => {
        render(<CurrencyCard crypto={mockCrypto} currency="USD" />)

        expect(screen.getByText('Bitcoin')).toBeInTheDocument()
        expect(screen.getByText('BTC')).toBeInTheDocument()
        expect(screen.getByText('$50000')).toBeInTheDocument()
    })

    it('shows positive price change in green', () => {
        render(
            <CurrencyCard
                crypto={{ ...mockCrypto, priceChangePercentage24h: 2.5 }}
                currency="USD"
            />
        )

        const priceChange = screen.getByText('+2.5%')
        expect(priceChange).toHaveClass('text-green-600')
    })

    it('shows negative price change in red', () => {
        render(
            <CurrencyCard
                crypto={{ ...mockCrypto, priceChangePercentage24h: -2.5 }}
                currency="USD"
            />
        )

        const priceChange = screen.getByText('-2.5%')
        expect(priceChange).toHaveClass('text-red-600')
    })

})