import './App.css';
import React, { useEffect } from 'react'
import { QueryClient, QueryClientProvider, QueryClientConfig } from 'react-query'
import MessageStack from './components/MessageStack/MessageStack';
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

import Home from './pages/Home/Home';
const client  = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
})


function App() {

  return (
    <BrowserRouter>
    <QueryClientProvider client={client}>
      <MessageStack>
        <Home/>
      </MessageStack>
      </QueryClientProvider> 
    </BrowserRouter>
  );
}

export default App;
