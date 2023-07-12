import './App.css';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import MessageStack from './components/MessageStack/MessageStack';
import {
  BrowserRouter
} from "react-router-dom";

import Home from './pages/Home/Home';
import { Provider as ReduxProvider } from 'react-redux';
import store from './redux';
const client  = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})

function App() {
  console.log(process.env)
  const basename = process.env.PUBLIC_URL;
  return (
    <BrowserRouter basename={basename}>
    <QueryClientProvider client={client}>
      <ReduxProvider store={store}>
        <MessageStack>
          <Home/>
        </MessageStack>
      </ReduxProvider>
      </QueryClientProvider> 
    </BrowserRouter>
  );
}

export default App;
