
import axios from 'axios';

// IMPORTANT: Replace this with your actual backend API base URL
const API_BASE_URL = 'http://localhost:3000'; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define the structure of your user and auth response data
// Adjust these interfaces to match your actual API response
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Define the types for the data we send to the API

export type RegisterData = Omit<User, 'id'> & { password: string };
export type LoginData = Pick<User, 'email'> & { password: string };


// Function to handle user registration
export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  // **FIXED HERE**: The code now expects the response to be nested inside a "data" property.
  // We tell TypeScript the expected shape is { data: AuthResponse }
  console.log("Registration Attempt")
  const response = await apiClient.post<{ data: AuthResponse }>('/api/v1/auth/sign-up', data);
  // And then we return the nested data object.
  return response.data.data;
};

// Function to handle user login
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  // **FIXED HERE**: Same fix as registration. We access the nested "data" property.
  console.log("Sign In Attempt")
  const response = await apiClient.post<{ data: AuthResponse }>('/api/v1/auth/sign-in', data);
  return response.data.data;
};

