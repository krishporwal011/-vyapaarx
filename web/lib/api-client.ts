import axios from 'axios';
import { toast } from 'react-hot-toast';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';
    
    if (error.response?.status === 401) {
      toast.error('Session expired. Please log in again.');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        // We will handle redirect via context or router in components, 
        // but can optionally force a reload or redirect here.
      }
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);
