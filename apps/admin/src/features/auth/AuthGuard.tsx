import React, { useEffect } from 'react';

import { useAuth } from './AuthContext.tsx';

interface AuthGuardProps {
  children: React.ReactNode;
  requirePermission?: string;
}

export function AuthGuard({ children, requirePermission }: AuthGuardProps) {
  const { isAuthenticated, isLoading, permissions } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const authUrl = (import.meta as any).env?.VITE_AUTH_URL || 'http://localhost:5174';
      globalThis.location.href = `${authUrl}/login?return_to=${
        encodeURIComponent(globalThis.location.href)
      }`;
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Loading authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        Redirecting to login portal...
      </div>
    );
  }

  if (requirePermission && !permissions.includes(requirePermission)) {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <h2>Forbidden</h2>
        <p>
          You do not have the required permission: <strong>{requirePermission}</strong>
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
