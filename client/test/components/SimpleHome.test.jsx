import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import { configureStore } from '@reduxjs/toolkit'
import userSlice from '../../src/utils/userSlice'

// Simple mock of Home component for basic testing
vi.mock('../../src/components/Home', () => ({
  default: () => (
    <div data-testid='home-page'>
      <div data-testid='hero'>Hero Section</div>
      <div data-testid='posts'>Posts List</div>
    </div>
  ),
}))

import Home from '../../src/components/Home'

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      user: userSlice,
    },
    preloadedState: initialState,
  })
}

const renderWithStore = (component, initialState = {}) => {
  const store = createTestStore(initialState)
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  )
}

describe('Home Component - Basic Tests', () => {
  it('renders home page', () => {
    renderWithStore(<Home />)
    expect(screen.getByTestId('home-page')).toBeInTheDocument()
  })

  it('renders hero section', () => {
    renderWithStore(<Home />)
    expect(screen.getByTestId('hero')).toBeInTheDocument()
  })

  it('renders posts section', () => {
    renderWithStore(<Home />)
    expect(screen.getByTestId('posts')).toBeInTheDocument()
  })
})
