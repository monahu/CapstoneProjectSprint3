import Body from './components/Body'
import { Provider } from 'react-redux'
import { ApolloProvider } from '@apollo/client'
import apolloClient from './utils/apolloClient'
import appStore from './utils/appStore'

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Provider store={appStore}>
        <Body />
      </Provider>
    </ApolloProvider>
  )
}

export default App
