'use client';

import axios from 'axios';
import { createContext, useContext, useState, useEffect } from 'react';
import { BACKEND_URL } from '../config/pages';
import { useRouter } from 'next/navigation';
import { Loader2, Router } from 'lucide-react';

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);
  const router = useRouter();

  const getCurrentUser = async () => {
    const storedToken = localStorage.getItem('access_token');
    if (!storedToken) {
      setIsLoading(false);
      router.push('/auth/login');
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });
      setUser(response.data);
      setToken(storedToken);
      setIsLoading(false);
    } catch (error) {
      logout();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    getCurrentUser();
  }, [mounted]);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('access_token', newToken);
    getCurrentUser();
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('Jobtrkr_token');
    router.replace('/auth/login');
  };

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex-grow flex justify-center items-center min-h-screen">
        <Loader2 className="h-20 w-20 animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!token, token, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
