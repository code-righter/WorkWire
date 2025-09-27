// src/api/authApi.js
import axios from './axiosConfig';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post('/auth/sign-in', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};