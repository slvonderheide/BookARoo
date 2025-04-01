import './App.css';
import { Outlet } from 'react-router-dom';
import react from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';

import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Replace with your Apollo Server URL
  credentials: 'include', // If using authentication
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const ApolloWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export { ApolloWrapper, App };

