// src/api/axiosConfig.js
import axios from 'axios';

// const API_BASE_URL = 'http://localhost:3000/api/v1/';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default axiosInstance