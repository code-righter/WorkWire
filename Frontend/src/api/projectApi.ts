// 1. API Layer: src/api/projectApi.ts (Create this new file)
// =================================================================================
// This file will handle all API calls related to projects.

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// We create a new axios instance for authenticated requests
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Project {
  _id: string; // Assuming MongoDB uses _id
  name: string;
  description: string;
  createdAt: string;
}

export type NewProjectData = Omit<Project, '_id' | 'createdAt'>;

// API function to get all projects
export const getProjects = async (): Promise<Project[]> => {
  // IMPORTANT: Update this endpoint to your actual "get projects" route
  const response = await apiClient.get('/api/v1/projects');
  // Assuming your backend nests the array in a 'data' property
  return response.data.data; 
};

// API function to create a new project
export const createProject = async (projectData: NewProjectData): Promise<Project> => {
  // IMPORTANT: Update this endpoint to your actual "create project" route
  const response = await apiClient.post('/api/v1/projects', projectData);
  // Assuming your backend nests the created object in a 'data' property
  return response.data.data;
};
