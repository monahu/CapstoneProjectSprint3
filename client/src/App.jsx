import Body from './components/Body';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './utils/apolloClient';
import appStore from './utils/appStore';
import { AuthProvider } from "./hooks/AuthContext";

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Provider store={appStore}>
        <AuthProvider>
          <Body />
        </AuthProvider>
      </Provider>
    </ApolloProvider>
  );
}

export default App;