import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { auth } from './firebase'
import { getApiUrl } from './config'
// =============================================================================
// CONFIGURATION
// =============================================================================

const isDevelopmentMode = import.meta.env.VITE_APP_MODE === 'development'

// =============================================================================
// HTTP LINK - GraphQL Endpoint Connection
// =============================================================================

const httpLink = createHttpLink({
  uri: getApiUrl('/graphql'),
  // Performance optimizations
  fetchOptions: {
    keepalive: true, // Keep connections alive for better performance
  },
})

// =============================================================================
// AUTH LINK - Attach Firebase Token to Requests
// =============================================================================

const authLink = setContext(async (_, { headers }) => {
  try {
    // Get current user from Firebase
    const currentUser = auth.currentUser

    // If no user, proceed without token
    if (!currentUser) {
      return {
        headers: {
          ...headers,
        },
      }
    }

    // Get the ID token (force refresh if near expiry for better UX)
    const token = await currentUser.getIdToken(false) // Don't force refresh unless needed

    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    }
  } catch (error) {
    console.warn('Auth token retrieval failed:', error.message)
    return { headers }
  }
})

// =============================================================================
// ERROR LINK - Global Error Handling
// =============================================================================

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  // Handle GraphQL errors
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      const errorInfo = {
        message,
        locations,
        path,
        operation: operation.operationName,
        extensions,
      }

      // Don't log auth errors in production (reduce noise)
      if (extensions?.code !== 'UNAUTHENTICATED' || isDevelopmentMode) {
        console.error('GraphQL Error:', errorInfo)
      }

      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED') {
        // Let auth manager handle this
        return
      }
    })
  }

  // Handle network errors
  if (networkError) {
    console.error('Network Error:', {
      message: networkError.message,
      operation: operation.operationName,
      statusCode: networkError.statusCode,
    })

    // Handle specific network errors
    if (networkError.statusCode === 401) {
      // Token might be expired, let auth manager handle
      return
    }
  }
})

// =============================================================================
// RETRY LINK - Intelligent Retry Logic
// =============================================================================

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error) => {
      // Only retry on network errors or 5xx server errors
      return (
        !!error &&
        (error.networkError?.statusCode >= 500 ||
          error.networkError?.name === 'ServerError' ||
          !error.networkError) // Retry on network connectivity issues
      )
    },
  },
})

// =============================================================================
// CACHE CONFIGURATION
// =============================================================================

const cache = new InMemoryCache({
  // Performance optimizations
  resultCaching: true,
  addTypename: true,

  typePolicies: {
    Query: {
      fields: {
        // Implement proper pagination for posts
        posts: {
          keyArgs: ['filter'], // Cache based on filter
          merge(existing = [], incoming, { args }) {
            // For offset-based pagination
            if (args?.offset === 0) {
              return incoming // Fresh query, replace existing
            }
            return [...existing, ...incoming] // Append for pagination
          },
        },
        // Cache search results separately
        searchPosts: {
          keyArgs: ['searchTerm', 'tags', 'location'],
          merge(_, incoming) {
            return incoming // Always replace search results
          },
        },
        // Cache tags aggressively
        tags: {
          merge(_, incoming) {
            return incoming
          },
        },
      },
    },
    Post: {
      fields: {
        // Optimistic updates for likes and want-to-go
        likeCount: {
          merge(existing, incoming) {
            return incoming
          },
        },
        attendeeCount: {
          merge(existing, incoming) {
            return incoming
          },
        },
        isLiked: {
          merge(existing, incoming) {
            return incoming
          },
        },
        isWantToGo: {
          merge(existing, incoming) {
            return incoming
          },
        },
      },
    },
  },

  // Garbage collection for better memory management
  possibleTypes: {},
  dataIdFromObject: (object) => {
    // Ensure consistent cache IDs
    return object.__typename && object.id
      ? `${object.__typename}:${object.id}`
      : null
  },
})

// =============================================================================
// APOLLO CLIENT INSTANCE
// =============================================================================

const apolloClient = new ApolloClient({
  link: from([errorLink, retryLink, authLink, httpLink]),
  cache,

  // Performance and development settings
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'partial',
      notifyOnNetworkStatusChange: false, // Reduce re-renders
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'partial',
    },
    mutate: {
      errorPolicy: 'partial',
      awaitRefetchQueries: false, // Don't block UI
    },
  },

  // Development features
  connectToDevTools: isDevelopmentMode,

  // Performance optimizations
  assumeImmutableResults: true, // Assume data is immutable for better performance
})

// =============================================================================
// CACHE PERSISTENCE (Optional for better offline experience)
// =============================================================================

// Clear cache on app version changes to prevent stale data
const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'
const CACHE_VERSION_KEY = 'apollo-cache-version'

if (typeof window !== 'undefined') {
  const storedVersion = localStorage.getItem(CACHE_VERSION_KEY)
  if (storedVersion !== APP_VERSION) {
    apolloClient.clearStore()
    localStorage.setItem(CACHE_VERSION_KEY, APP_VERSION)
  }
}

export default apolloClient
