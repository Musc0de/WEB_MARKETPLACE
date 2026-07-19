import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent bfcache in development to avoid Vite HMR WebSocket errors
if ((import.meta as any).env.DEV) {
  globalThis.addEventListener('pagehide', () => {});
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
