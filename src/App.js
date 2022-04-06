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
  const authToken = 'gkR5axY29MiWDYalkqWP9B4HVIMUf23auVGFZVvmQ3uyNIa1oEO4t5tuSg3cFPtQ';
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
