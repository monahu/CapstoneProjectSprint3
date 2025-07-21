import { Suspense, lazy } from 'react'
import { Provider } from 'react-redux'
import { ApolloProvider } from '@apollo/client'
import apolloClient from './utils/apolloClient'
import appStore from './utils/appStore'
import LoadingState from './components/LoadingState'

// Lazy load components to reduce initial bundle size
const Body = lazy(() => import('./components/Body'))
const AuthManager = lazy(() =>
  import('./hooks/AuthManager').then((module) => ({
    default: module.AuthManager,
  }))
)

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Provider store={appStore}>
        <Suspense fallback={<LoadingState />}>
          <AuthManager>
            <Suspense fallback={<LoadingState />}>
              <Body />
            </Suspense>
          </AuthManager>
        </Suspense>
      </Provider>
    </ApolloProvider>
  )
}

export default App
