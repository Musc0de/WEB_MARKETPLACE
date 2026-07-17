import React from 'react';
import ReactDOM from 'react-dom/client';
import { SWRConfig } from 'swr';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SWRConfig
      value={{
        // Prevent refetch when user refocuses the window — main cause of duplicate calls
        revalidateOnFocus: false,
        // Prevent refetch on network reconnect
        revalidateOnReconnect: false,
        // Deduplicate identical requests within a 10 second window
        dedupingInterval: 10000,
        // Only retry failed requests once to avoid hammering the server
        errorRetryCount: 1,
        // Keep previous data visible while revalidating (better UX)
        keepPreviousData: true,
      }}
    >
      <App />
    </SWRConfig>
  </React.StrictMode>,
);
