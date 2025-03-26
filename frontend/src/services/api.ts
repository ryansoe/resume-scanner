import axios from 'axios';

// Create axios instance with base URL that works in production
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://resume-scanner-api.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', error);
    }
    
    return Promise.reject(error);
  }
); 