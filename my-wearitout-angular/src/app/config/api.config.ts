// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Products
  PRODUCTS: {
   
    TOP_RATED: 'api/v1/product/top-rated',
    TRENDING: 'api/v1/product/trending',
    SEARCH: 'api/v1/product/search',
    BY_SHOP: (shopId: number) => `api/v1/product/shop/${shopId}`,
    BY_ID: (id: number) => `api/v1/product/${id}`,
  },
  
  // Authentication
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    REFRESH: '/api/v1/auth/refresh',
    LOGOUT: '/api/v1/auth/logout',
    PROFILE: '/api/v1/auth/profile',
  },
  
  // Shops
  SHOPS: {
    BASE: '/api/v1/shops',
    BY_ID: (id: number) => `/api/v1/shops/${id}`,
    BY_USER: (userId: number) => `/api/v1/shops/user/${userId}`,
    SEARCH: '/api/v1/shops/search',
  },
  
  // Categories
  CATEGORIES: {
    BASE: 'categories',
    BY_ID: (id: number) => `categories/${id}`,
  },
  
  // Orders
  ORDERS: {
    BASE: 'orders',
    BY_ID: (id: number) => `orders/${id}`,
    BY_USER: (userId: number) => `orders/user/${userId}`,
    BY_SHOP: (shopId: number) => `orders/shop/${shopId}`,
  },
  
  // Cart
  CART: {
    BASE: 'cart',
    ADD: 'cart/add',
    REMOVE: 'cart/remove',
    UPDATE: 'cart/update',
    CLEAR: 'cart/clear',
  }
} as const;

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// API Error Response
export interface ApiError {
  error: string;
  message: string;
  status: number;
  timestamp: string;
  path: string;
}