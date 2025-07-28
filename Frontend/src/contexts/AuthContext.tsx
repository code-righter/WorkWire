import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { type User,type  AuthResponse, loginUser, registerUser, type LoginData, type  RegisterData } from '../api/authApi.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs on initial app load to verify the stored token
    const verifyUser = async () => {
      if (token) {
        // Here you would typically have an API endpoint to verify the token
        // and get the user's data. For now, we'll decode it or fetch user.
        // For simplicity, we assume if a token exists, we need to fetch user data.
        // Let's pretend we have a `getUserProfile` endpoint.
        // Since we don't, we'll just parse the user from localStorage for this example.
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // If no user data, the token is invalid/stale
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    verifyUser();
  }, [token]);

  const handleAuthResponse = (data: AuthResponse) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const login = async (data: LoginData) => {
    console.log("AuthContext: 'login' function triggered with data:", data);
    const response = await loginUser(data);
    console.log("AuthContext: 'loginUser' API call was successful.");
    handleAuthResponse(response);
  };

  const register = async (data: RegisterData) => {
    console.log("AuthContext: 'register' function triggered with data:", data); // DEBUG LOG
    const response = await registerUser(data);
    console.log("AuthContext: 'registerUser' API call was successful.");
    handleAuthResponse(response);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
