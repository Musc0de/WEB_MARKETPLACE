import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent bfcache in development to avoid Vite HMR WebSocket errors
if (import.meta.env.DEV) {
  global.addEventListener('unload', () => {});
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
