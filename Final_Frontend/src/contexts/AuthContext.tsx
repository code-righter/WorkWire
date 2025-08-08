import React, { createContext, useContext, useEffect, useState } from 'react';

// You might want to add 'name' to your User interface
interface User {
  _id: any;
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  // Updated signUp signature to include the 'name' field
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// !! IMPORTANT: Replace these with your actual backend API endpoints !!
const API_URL = "http://localhost:3000/api/v1"; // Or your deployed backend URL
const SIGN_IN_URL = `${API_URL}/auth/sign-in`;
const SIGN_UP_URL = `${API_URL}/auth/sign-up`;
const GET_USER_URL = `${API_URL}/projects/listProjects/`; // A protected route to get current user data

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Verify the token by fetching user data from a protected route
          const response = await fetch(GET_USER_URL, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Session expired or invalid.");
          }

          const userData: User = await response.json();
          setUser(userData);
        } catch (error) {
          console.error("Session check failed:", error);
          // If token is invalid, clear it
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUserSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await fetch(SIGN_IN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to sign in.');
    }

    // The backend nests the response inside a 'data' object
    const responseData = await response.json();
    const { user: userData, token } = responseData.data; // Destructure from responseData.data

    console.log("✅ AuthContext: User signed in. User data:", userData);

    localStorage.setItem('authToken', token);
    setUser(userData);
  };

  // Updated signUp function to include `name`
  const signUp = async (name: string, email: string, password: string) => {
    const response = await fetch(SIGN_UP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to sign up.');
    }

    // Backend might automatically sign in the user, or just create an account.
    // This example assumes it also returns a token and user data.
    const { user: userData, token } = await response.json();
    localStorage.setItem('authToken', token);
    setUser(userData);
  };

  const signOut = async () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const value = { user, loading, signIn, signUp, signOut };

  return (
    <AuthContext.Provider value={value}>
      {/* Show children only when not in initial loading state */}
      {!loading && children}
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