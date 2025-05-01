import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import CurrencyList from '@/components/features/currency/CurrencyList'

jest.mock('@/lib/hooks/useCurrency', () => ({
    useCurrency: () => ({ currency: 'USD' })
}))

describe('CurrencyList Component', () => {
    const mockCryptocurrencies:any = [
        {
            id: 'bitcoin',
            name: 'Bitcoin',
            symbol: 'BTC',
            currentPrice: 50000,
            marketCap: 1000000000000,
            marketCapRank: 1,
            totalVolume: 30000000000,
            priceChangePercentage24h: 2.5
        },
        {
            id: 'ethereum',
            name: 'Ethereum',
            symbol: 'ETH',
            currentPrice: 3000,
            marketCap: 350000000000,
            marketCapRank: 2,
            totalVolume: 15000000000,
            priceChangePercentage24h: -1.2
        }
    ]

    it('renders a list of cryptocurrencies', () => {
        render(
            <CurrencyList
        cryptocurrencies={ mockCryptocurrencies }
        isLoading = { false}
        error = { null}
            />
    )

        expect(screen.getByTestId('currency-card-bitcoin')).toBeInTheDocument()
        expect(screen.getByTestId('currency-card-ethereum')).toBeInTheDocument()
    })

    it('shows loading spinner when isLoading is true', () => {
        render(
            <CurrencyList
        cryptocurrencies={ []}
        isLoading = { true}
        error = { null}
            />
    )

        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
        expect(screen.getByText('Loading cryptocurrencies...')).toBeInTheDocument()
    })

    it('shows error message when there is an error', () => {
        const error = new Error('Failed to fetch')
        render(
            <CurrencyList
        cryptocurrencies={ []}
        isLoading = { false}
        error = { error }
            />
    )

        expect(screen.getByTestId('error-message')).toBeInTheDocument()
        expect(screen.getByText('Failed to load cryptocurrencies')).toBeInTheDocument()
        expect(screen.getByText('Failed to fetch')).toBeInTheDocument()
    })

    it('calls onRetry when retry button is clicked', () => {
        const onRetry = jest.fn()
        const error = new Error('Failed to fetch')

        render(
            <CurrencyList
        cryptocurrencies={ []}
        isLoading = { false}
        error = { error }
        onRetry = { onRetry }
            />
    )

        fireEvent.click(screen.getByText('Try Again'))
        expect(onRetry).toHaveBeenCalledTimes(1)
    })

   

    it('shows message when no cryptocurrencies are available', () => {
        render(
            <CurrencyList
        cryptocurrencies={ []}
        isLoading = { false}
        error = { null}
            />
    )

        expect(screen.getByText('No cryptocurrencies found')).toBeInTheDocument()
    })
})