import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Card from '@/components/ui/Card'

describe('Card Component', () => {
    it('renders children correctly', () => {
        render(<Card>Test Content</Card>)
        expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('applies clickable styles when clickable prop is true', () => {
        render(<Card clickable>Clickable Card</Card>)
        const card = screen.getByText('Clickable Card').closest('div')
        expect(card).toHaveClass('cursor-pointer')
    })

    it('calls onClick handler when clicked', () => {
        const handleClick = jest.fn()
        render(<Card clickable onClick={handleClick}>Clickable Card</Card>)
        fireEvent.click(screen.getByText('Clickable Card'))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('applies selected styles when selected prop is true', () => {
        render(<Card selected>Selected Card</Card>)
        const card = screen.getByText('Selected Card').closest('div')
        expect(card).toHaveClass('ring-2')
    })
})
