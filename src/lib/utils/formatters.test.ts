import { formatCurrency, formatPercentage, formatLargeNumber } from '@/lib/utils/formatters'

describe('formatters', () => {
    describe('formatCurrency', () => {
        it('formats USD correctly', () => {
            expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56')
        })

        it('formats EUR correctly', () => {
            expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56')
        })

        it('handles small values with more precision', () => {
            expect(formatCurrency(0.0000123, 'USD')).toMatch(/\$0\.000012/)
        })

        it('formats large values with abbreviations', () => {
            expect(formatCurrency(1500000, 'USD')).toMatch(/\$1\.50M/)
        })
    })

    describe('formatPercentage', () => {
        it('formats positive percentages correctly', () => {
            expect(formatPercentage(0.0567)).toBe('5.67%')
        })

        it('formats negative percentages correctly', () => {
            expect(formatPercentage(-0.0567)).toBe('-5.67%')
        })
    })

    describe('formatLargeNumber', () => {
        it('formats thousands correctly', () => {
            expect(formatLargeNumber(1500)).toMatch(/1\.50K/)
        })

        it('formats millions correctly', () => {
            expect(formatLargeNumber(1500000)).toMatch(/1\.50M/)
        })

        it('formats billions correctly', () => {
            expect(formatLargeNumber(1500000000)).toMatch(/1\.50B/)
        })
    })
})
