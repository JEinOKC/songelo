import React from 'react';
import ReactDOM from 'react-dom/client';  // Import ReactDOM for rendering the app
import Main from './app/Main';  // Import the Main component, which contains your routes
import { AppStateProvider } from './stores/AppStateContext';
import { AuthStateProvider } from './stores/AuthStateContext';

// Find the root div in index.html to mount the React app
const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

// Render the Main component inside the root div
root.render(
  <React.StrictMode>
    <AuthStateProvider>
      <AppStateProvider>
        <Main />  {/* Main handles routing */}
      </AppStateProvider>
    </AuthStateProvider>
  </React.StrictMode>
);
