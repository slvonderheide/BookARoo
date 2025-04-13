import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';

import Navbar from './components/Navbar';

const httpLink = createHttpLink({
  uri: '/graphql', // Replace with your Apollo Server URL
  credentials: 'include', // If using authentication
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});



function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}



export default App;

