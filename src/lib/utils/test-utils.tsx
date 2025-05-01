import React, { PropsWithChildren } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import CurrencyProvider from '@/components/providers/CurrencyProvider'
import RecentViewsProvider from '@/components/providers/RecentViewsProvider'

// Create a custom renderer that includes your providers
const AllTheProviders = ({ children }: PropsWithChildren) => {
    return (
        <CurrencyProvider>
            <RecentViewsProvider>
                {children}
            </RecentViewsProvider>
        </CurrencyProvider>
    )
}

const customRender = (
    ui: React.ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything from testing library
export * from '@testing-library/react'
export { customRender as render }
