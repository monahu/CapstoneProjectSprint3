import { render } from "@testing-library/react"
import { Provider } from "react-redux"
import { ApolloProvider } from "@apollo/client"
import { BrowserRouter } from "react-router"
import { configureStore } from "@reduxjs/toolkit"
import { vi } from "vitest"
import userSlice from "../utils/userSlice"

// Mock Apollo Client
export const mockApolloClient = {
  query: vi.fn(),
  mutate: vi.fn(),
  cache: {
    writeQuery: vi.fn(),
    readQuery: vi.fn(),
  },
  watchQuery: vi.fn(() => ({
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
  })),
}

// Mock Redux Store
export const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      user: userSlice,
    },
    preloadedState: initialState,
  })
}

// Custom render function with all providers
export const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = createMockStore(preloadedState),
    apolloClient = mockApolloClient,
    ...renderOptions
  } = {}
) => {
  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <ApolloProvider client={apolloClient}>
          <Provider store={store}>{children}</Provider>
        </ApolloProvider>
      </BrowserRouter>
    )
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

// Mock Firebase Auth
export const mockFirebaseAuth = {
  currentUser: null,
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  signOut: vi.fn(),
}

// Mock user data
export const mockUser = {
  uid: "test-uid-123",
  email: "test@example.com",
  displayName: "testuser",
  photoURL: "https://api.dicebear.com/6.x/avataaars/svg?seed=1",
  firstName: "Test",
  lastName: "User",
  phone: "+1234567890",
}

// Mock form data
export const mockSignUpData = {
  email: "test@example.com",
  password: "password123",
  confirmPassword: "password123",
  userName: "testuser",
  firstName: "Test",
  lastName: "User",
  phone: "+1234567890",
}

export const mockSignInData = {
  email: "test@example.com",
  password: "password123",
}
