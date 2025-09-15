import { create } from 'zustand';
import { Product, ProductFilters } from '@/types';
import { productApi } from '@/lib/api';

interface ProductState {
  products: Product[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;
  
  // Actions
  fetchProducts: (limit?: number) => Promise<void>;
  fetchProductById: (id: number) => Promise<Product>;
  fetchCategories: () => Promise<void>;
  fetchProductsByCategory: (category: string, limit?: number) => Promise<void>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  
  // Admin actions (mocked)
  addProduct: (product: Omit<Product, 'id' | 'rating'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  
  // Computed
  getFilteredProducts: () => Product[];
  getProductById: (id: number) => Product | undefined;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  isLoading: false,
  error: null,
  filters: {},
  
  fetchProducts: async (limit?: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await productApi.getAll(limit);
      set({ products: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  fetchProductById: async (id: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await productApi.getById(id);
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
  
  fetchCategories: async () => {
    try {
      const response = await productApi.getCategories();
      set({ categories: response.data });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
  
  fetchProductsByCategory: async (category: string, limit?: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await productApi.getByCategory(category, limit);
      set({ products: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  setFilters: (newFilters: Partial<ProductFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },
  
  clearFilters: () => {
    set({ filters: {} });
  },
  
  // Admin actions (mocked - no real API writes)
  addProduct: (productData) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now(), // Generate mock ID
      rating: { rate: 0, count: 0 },
    };
    
    set((state) => ({
      products: [newProduct, ...state.products]
    }));
  },
  
  updateProduct: (id: number, productData: Partial<Product>) => {
    set((state) => ({
      products: state.products.map(product =>
        product.id === id ? { ...product, ...productData } : product
      )
    }));
  },
  
  deleteProduct: (id: number) => {
    set((state) => ({
      products: state.products.filter(product => product.id !== id)
    }));
  },
  
  getFilteredProducts: () => {
    const { products, filters } = get();
    
    return products.filter(product => {
      if (filters.category && product.category !== filters.category) {
        return false;
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (
          !product.title.toLowerCase().includes(searchLower) &&
          !product.description.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }
      
      if (filters.minPrice && product.price < filters.minPrice) {
        return false;
      }
      
      if (filters.maxPrice && product.price > filters.maxPrice) {
        return false;
      }
      
      return true;
    });
  },
  
  getProductById: (id: number) => {
    return get().products.find(product => product.id === id);
  },
}));