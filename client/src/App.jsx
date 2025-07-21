import Body from './components/Body'
import { Provider } from 'react-redux'
import { ApolloProvider } from '@apollo/client'
import apolloClient from './utils/apolloClient'
import appStore from './utils/appStore'
import { AuthManager } from './hooks'

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Provider store={appStore}>
        <AuthManager>
          <Body />
        </AuthManager>
      </Provider>
    </ApolloProvider>
  )
}

export default App
