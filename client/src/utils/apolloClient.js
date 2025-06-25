import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { auth } from './firebase'

// HTTP link for GraphQL endpoint
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:3500/graphql',
})

// Auth link to include Firebase token
const authLink = setContext(async (_, { headers }) => {
  let token = ''

  try {
    const currentUser = auth.currentUser
    if (currentUser) {
      token = await currentUser.getIdToken()
      console.log('🔐 Apollo Auth - Token generated, length:', token.length)
    } else {
      console.log('🔓 Apollo Auth - No current user')
    }
  } catch (error) {
    console.error('❌ Apollo Auth - Error getting token:', error)
  }

  console.log('📡 Apollo Auth - Request headers:', {
    hasAuth: !!token,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'none',
  })

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const isDevelopmentMode = import.meta.env.VITE_APP_MODE === 'development'
const hasBackend = import.meta.env.VITE_HAS_BACKEND === 'true'

// Error link for handling GraphQL errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    )
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`)

    // In development without backend, just log and continue
    if (isDevelopmentMode && !hasBackend) {
      console.log('🚧 Backend not ready - this is expected in development')
      return
    }

    // Handle 401 errors - redirect to login
    if (networkError.statusCode === 401) {
      window.location.href = '/login'
    }
  }
})

// Apollo Client instance
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(/* {
    typePolicies: {
      Query: {
        fields: {
          posts: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  } */),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
})

export default client
