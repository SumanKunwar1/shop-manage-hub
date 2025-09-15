export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
  };
  phone: string;
}

export interface CartItem {
  productId: number;
  quantity: number;
  product: Product;
}

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface ProductForm {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}