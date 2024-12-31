import React from 'react';
import ReactDOM from 'react-dom/client';  // Import ReactDOM for rendering the app
import Main from './Main';  // Import the Main component, which contains your routes

// Find the root div in index.html to mount the React app
const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

// Render the Main component inside the root div
root.render(
  <React.StrictMode>
    <Main />  {/* Main handles routing */}
  </React.StrictMode>
);
