import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import { configureStore } from '@reduxjs/toolkit'
import { Sidebar } from '../../src/components/Sidebar'
import userSlice from '../../src/utils/userSlice'

// Mock the hooks
vi.mock('../../src/hooks/usePost', () => ({
  useTags: () => ({ tags: [] })
}))

vi.mock('../../src/hooks/useTagSelection', () => ({
  useTagSelection: () => ({
    currentTags: [],
    handleTagClick: vi.fn()
  })
}))

const createMockStore = (user = null) => {
  return configureStore({
    reducer: {
      user: userSlice
    },
    preloadedState: {
      user: {
        data: user,
        authInitialized: true
      }
    }
  })
}

const renderSidebar = (user = null) => {
  const store = createMockStore(user)
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Sidebar sidebarOpen={false} setSidebarOpen={vi.fn()} />
      </BrowserRouter>
    </Provider>
  )
}

describe('Sidebar', () => {
  it('should show only Home and Login for non-logged-in users', () => {
    renderSidebar(null)
    
    // Should show Home and Login
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
    
    // Should NOT show Create, Profile, or Explore
    expect(screen.queryByText('Create')).not.toBeInTheDocument()
    expect(screen.queryByText('Profile')).not.toBeInTheDocument()
    expect(screen.queryByText('Explore')).not.toBeInTheDocument()
  })

  it('should show full navigation for logged-in users', () => {
    const mockUser = { id: 1, name: 'Test User', email: 'test@example.com' }
    renderSidebar(mockUser)
    
    // Should show Home, Create, Profile, and Explore
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Create')).toBeInTheDocument()
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Explore')).toBeInTheDocument()
    
    // Should NOT show Login
    expect(screen.queryByText('Login')).not.toBeInTheDocument()
  })
})