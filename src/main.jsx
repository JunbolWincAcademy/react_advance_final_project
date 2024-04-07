import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';

// Import the App component that includes all your routes and context providers
import { App } from './App';

// Create the root of your application
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ChakraProvider> {/* ChakraProvider to apply Chakra UI styles globally */}
      <BrowserRouter> {/* BrowserRouter to enable routing for your application */}
        <App /> {/* Your main application component that includes all routes and context */}
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
