import React, { createContext, useContext, useEffect, useState } from 'react';
import { client } from '../../lib/rpc.ts';

type UserData = {
  id: string;
  email: string;
  username: string;
  status: string;
  emailVerified: boolean;
};

type AuthContextType = {
  user: UserData | null;
  permissions: string[];
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await client.v1.auth.me.$get();
        if (res.ok) {
          const json = await res.json();
          setUser(json.data.user);
          setPermissions(json.data.permissions || []);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
        setError(err instanceof Error ? err : new Error('Failed to load user'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await client.v1.auth.logout.$post();
      setUser(null);
      setPermissions([]);
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        isLoading,
        error,
        isAuthenticated: !!user,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
