import axios, { AxiosError, AxiosResponse } from 'axios';
import { Product, User } from '@/types';

const BASE_URL = 'https://fakestoreapi.com';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.message);
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      sessionStorage.removeItem('auth-token');
      sessionStorage.removeItem('auth-user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const productApi = {
  getAll: (limit?: number) => 
    api.get<Product[]>(`/products${limit ? `?limit=${limit}` : ''}`),
  
  getById: (id: number) => 
    api.get<Product>(`/products/${id}`),
  
  getCategories: () => 
    api.get<string[]>('/products/categories'),
  
  getByCategory: (category: string, limit?: number) => 
    api.get<Product[]>(`/products/category/${category}${limit ? `?limit=${limit}` : ''}`),
};

export const userApi = {
  getAll: (limit?: number) => 
    api.get<User[]>(`/users${limit ? `?limit=${limit}` : ''}`),
  
  getById: (id: number) => 
    api.get<User>(`/users/${id}`),
};

// Mock auth API (since Fake Store API doesn't provide proper auth)
export const authApi = {
  login: async (email: string, password: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication - in real app, this would be API call
    if (email === 'admin@example.com' && password === 'admin123') {
      return {
        data: {
          id: 1,
          email,
          username: 'admin',
          token: 'mock-jwt-token-' + Date.now(),
        }
      };
    }
    
    throw new Error('Invalid credentials');
  },
  
  signup: async (userData: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful signup
    return {
      data: {
        id: Date.now(),
        email: userData.email,
        username: userData.username,
        token: 'mock-jwt-token-' + Date.now(),
      }
    };
  },
};

export default api;