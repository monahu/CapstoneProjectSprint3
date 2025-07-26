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
import appStore from './appStore'
import { getApiUrl } from './config'
// =============================================================================
// CONFIGURATION
// =============================================================================

const isDevelopmentMode = import.meta.env.VITE_APP_MODE === 'development'
const hasBackend = import.meta.env.VITE_HAS_BACKEND === 'true'

// =============================================================================
// HTTP LINK - GraphQL Endpoint Connection
// =============================================================================

const httpLink = createHttpLink({
  uri: getApiUrl('/graphql'),
})

// =============================================================================
// AUTH LINK - Automatic Firebase Token Injection
// It uses setContext (from @apollo/client/link/context) to modify the request context before each request is sent.
// =============================================================================

const authLink = setContext(async (_, { headers }) => {
  let token = ''

  try {
    const currentUser = auth.currentUser
    if (currentUser) {
      // Use cached token first for performance
      token = await currentUser.getIdToken(false)
    } else {
      // Only log if auth has definitely initialized (not just starting up)
      const { authInitialized } = appStore.getState().user
      if (authInitialized) {
        console.log('🔓 Apollo Auth - No current user')
      }
    }
  } catch (error) {
    console.error('❌ Apollo Auth - Error getting token:', error)

    // Fallback: Try to get fresh token on error
    try {
      if (auth.currentUser) {
        token = await auth.currentUser.getIdToken(true) // Force refresh
        console.log('🔄 Fallback token refresh successful')
      }
    } catch (refreshError) {
      console.error('❌ Token refresh failed:', refreshError)
    }
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

// =============================================================================
// ERROR LINK - Smart Error Handling with Token Refresh
// =============================================================================

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    // Handle GraphQL errors (validation, business logic, etc.)
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      })
    }

    // Handle network errors (HTTP status codes, connection issues, etc.)
    if (networkError) {
      console.error(`Network error:`, networkError)

      // Development mode: Allow operation without backend
      if (isDevelopmentMode && !hasBackend) {
        console.log('🚧 Backend not ready - this is expected in development')
        return
      }

      // Handle authentication errors (401 Unauthorized)
      if (networkError.statusCode === 401) {
        return handleAuthenticationError(networkError, operation, forward)
      }
    }
  }
)

/**
 * Handle 401 authentication errors with smart token refresh
 */
const handleAuthenticationError = (networkError, operation, forward) => {
  const errorBody = networkError.result || {}

  // Check if this is a token expiration error
  if (errorBody.code === 'TOKEN_EXPIRED') {
    console.log('🔄 Token expired, attempting refresh...')

    if (auth.currentUser) {
      // Force token refresh and retry the operation
      return auth.currentUser
        .getIdToken(true)
        .then(() => {
          console.log('✅ Token refreshed, retrying operation')
          // The authLink will automatically pick up the fresh token
          return forward(operation)
        })
        .catch((refreshError) => {
          console.error('❌ Token refresh failed:', refreshError)
          redirectToLogin('Token refresh failed')
        })
    } else {
      redirectToLogin('No current user for token refresh')
    }
  } else {
    // For other 401 errors, redirect to login immediately
    redirectToLogin('Authentication required')
  }
}

/**
 * Redirect user to login page with logging
 */
const redirectToLogin = (reason) => {
  console.log(`🔐 ${reason}, redirecting to login`)
  window.location.href = '/login'
}

// =============================================================================
// RETRY LINK - Network Failure Recovery
// =============================================================================

const retryLink = new RetryLink({
  delay: {
    initial: 300, // Start with 300ms delay
    max: Infinity, // No maximum delay
    jitter: true, // Add randomness to prevent thundering herd
  },
  attempts: {
    max: 3, // Maximum 3 retry attempts
    retryIf: (error) => {
      // Only retry on network errors, not authentication errors
      return !!error && !error.statusCode
    },
  },
})

// =============================================================================
// APOLLO CLIENT INSTANCE
// =============================================================================

const client = new ApolloClient({
  // Link chain: Error handling → Retries → Authentication → HTTP
  link: from([errorLink, retryLink, authLink, httpLink]),

  // Cache configuration
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            // Define how posts pagination should be merged
            keyArgs: [], // No keyArgs needed since filters are not used
            merge(existing = { posts: [], totalCount: 0 }, incoming, { args }) {
              // Handle pagination merge
              if (args?.offset > 0) {
                // This is a fetchMore call - append new posts
                return {
                  ...incoming,
                  posts: [...existing.posts, ...incoming.posts]
                }
              }
              // This is a fresh query - replace existing
              return incoming
            }
          },
          searchPosts: {
            // Merge search results for pagination
            keyArgs: ["searchTerm", "tags", "location"],
            merge(existing = [], incoming, { args }) {
              if (args?.offset > 0) {
                return [...existing, ...incoming]
              }
              return incoming
            }
          }
        }
      },
      Post: {
        fields: {
          // Ensure these fields are replaced, not merged
          likeCount: {
            merge: false // Always replace with new value
          },
          shareCount: {
            merge: false
          },
          attendeeCount: {
            merge: false
          },
          isLiked: {
            merge: false
          },
          isWantToGo: {
            merge: false
          },
          isOwner: {
            merge: false
          },
          // Handle array fields properly
          likes: {
            merge: false // Replace entire array
          },
          attendees: {
            merge: false // Replace entire array
          },
          tags: {
            merge: false // Replace entire array
          }
        }
      }
    },
    // Additional cache configuration
    addTypename: true, // Add __typename to all objects
    resultCaching: true, // Cache query results
    canonizeResults: true, // Normalize identical objects
  }),

  // Default options for all queries/mutations
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all', // Return both data and errors
    },
    query: {
      errorPolicy: 'all', // Return both data and errors
    },
  },
})

export default client
