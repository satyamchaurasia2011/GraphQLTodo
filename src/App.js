import './App.css';
import Todo from './components/Todo';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
  HttpLink
} from "@apollo/client";

function App() {
  const authToken =process.env.REACT_APP_AUTH_TOKEN;
  const client = (authToken) => {
    return new ApolloClient({
      link: new HttpLink({
        uri: "https://settled-grub-42.hasura.app/v1/graphql",
        headers: {
          
           'x-hasura-admin-secret': authToken,
        },
      }),
      cache: new InMemoryCache(),
    });
  };
  return (
    <ApolloProvider client={client(authToken)}>
    <div className="App">
      <Todo/>
    </div>
    </ApolloProvider>
  );
}

export default App;
