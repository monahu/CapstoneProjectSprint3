import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Hero from '../../src/components/Hero'

describe('Hero Component', () => {
  const defaultProps = {
    heroImage: 'test-image.jpg',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders hero section with image', () => {
    render(<Hero {...defaultProps} />)

    const heroDiv = document.querySelector('.hero')
    expect(heroDiv).toBeInTheDocument()

    // Check that the background-image style is applied (Hero uses CSS background, not img element)
    expect(heroDiv).toHaveStyle('background-image: url("test-image.jpg")')
  })

  it('renders with custom content', () => {
    render(
      <Hero
        {...defaultProps}
        title='Welcome to RestJam'
        description='Discover amazing restaurants'
        buttonText='Get Started'
      />
    )

    expect(screen.getByText('Welcome to RestJam')).toBeInTheDocument()
    expect(screen.getByText('Discover amazing restaurants')).toBeInTheDocument()
    expect(screen.getByText('Get Started')).toBeInTheDocument()
  })

  it('handles button click', async () => {
    const mockOnButtonClick = vi.fn()
    const user = userEvent.setup()

    render(
      <Hero
        {...defaultProps}
        onButtonClick={mockOnButtonClick}
        buttonText='Click Me'
      />
    )

    await user.click(screen.getByText('Click Me'))
    expect(mockOnButtonClick).toHaveBeenCalledOnce()
  })

  it('hides button when showButton is false', () => {
    render(
      <Hero
        {...defaultProps}
        showButton={false}
        buttonText='Hidden Button'
      />
    )

    expect(screen.queryByText('Hidden Button')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <Hero
        {...defaultProps}
        className='custom-hero-class'
      />
    )

    const heroDiv = document.querySelector('.hero')
    expect(heroDiv).toHaveClass('custom-hero-class')
  })
})
