// API Service for Taksha Veda - Complete Backend Integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to handle API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem('auth_token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiRequest<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    userType: string;
    phone?: string;
  }) => {
    return await apiRequest<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  googleAuth: async () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  },

  getCurrentUser: async () => {
    return await apiRequest<{ user: any }>('/auth/me');
  },

  updateProfile: async (profileData: any) => {
    return await apiRequest<{ user: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  logout: async () => {
    await apiRequest('/auth/logout', { method: 'POST' });
    localStorage.removeItem('auth_token');
  },
};

// Products API
export const productsAPI = {
  getAll: async (params: {
    category?: string;
    series?: string;
    search?: string;
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    return await apiRequest<{
      products: any[];
      pagination: {
        total: number;
        page: number;
        pages: number;
        limit: number;
      };
    }>(endpoint);
  },

  getById: async (id: string) => {
    return await apiRequest<{ product: any }>(`/products/${id}`);
  },

  create: async (productData: any) => {
    return await apiRequest<{ product: any }>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  update: async (id: string, productData: any) => {
    return await apiRequest<{ product: any }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  delete: async (id: string) => {
    return await apiRequest<{ message: string }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  addReview: async (productId: string, reviewData: {
    rating: number;
    comment: string;
    title?: string;
  }) => {
    return await apiRequest<{ review: any }>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  getCategories: async () => {
    return await apiRequest<{ categories: any[] }>('/products/categories');
  },

  getSeries: async () => {
    return await apiRequest<{ series: any[] }>('/products/series');
  },
};

// Orders API
export const ordersAPI = {
  getAll: async (params: {
    status?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/orders?${queryString}` : '/orders';
    
    return await apiRequest<{
      orders: any[];
      pagination: any;
    }>(endpoint);
  },

  getById: async (id: string) => {
    return await apiRequest<{ order: any }>(`/orders/${id}`);
  },

  create: async (orderData: {
    items: any[];
    shippingAddress: any;
    paymentMethod: string;
    couponCode?: string;
  }) => {
    return await apiRequest<{ order: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  cancel: async (id: string) => {
    return await apiRequest<{ order: any }>(`/orders/${id}/cancel`, {
      method: 'POST',
    });
  },

  updateStatus: async (id: string, status: string) => {
    return await apiRequest<{ order: any }>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Admin only
  getAllOrders: async (params: {
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/orders/admin/all?${queryString}` : '/orders/admin/all';
    
    return await apiRequest<{
      orders: any[];
      pagination: any;
    }>(endpoint);
  },
};

// Cart API
export const cartAPI = {
  get: async () => {
    return await apiRequest<{ cart: any }>('/cart');
  },

  add: async (productId: string, quantity: number = 1, variant?: any) => {
    return await apiRequest<{ cart: any }>('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, variant }),
    });
  },

  update: async (productId: string, quantity: number) => {
    return await apiRequest<{ cart: any }>(`/cart/update/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  remove: async (productId: string) => {
    return await apiRequest<{ cart: any }>(`/cart/remove/${productId}`, {
      method: 'DELETE',
    });
  },

  clear: async () => {
    return await apiRequest<{ cart: any }>('/cart/clear', {
      method: 'DELETE',
    });
  },
};

// Wishlist API
export const wishlistAPI = {
  get: async () => {
    return await apiRequest<{ wishlist: any }>('/wishlist');
  },

  add: async (productId: string) => {
    return await apiRequest<{ wishlist: any }>('/wishlist/add', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },

  remove: async (productId: string) => {
    return await apiRequest<{ wishlist: any }>(`/wishlist/remove/${productId}`, {
      method: 'DELETE',
    });
  },

  toggle: async (productId: string) => {
    return await apiRequest<{ wishlist: any; added: boolean }>('/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },
};

// Payment API
export const paymentAPI = {
  createOrder: async (orderData: {
    amount: number;
    currency?: string;
    orderId: string;
  }) => {
    return await apiRequest<{ 
      razorpayOrderId: string;
      amount: number;
      currency: string;
      key: string;
    }>('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  verifyPayment: async (paymentData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    orderId: string;
  }) => {
    return await apiRequest<{ 
      success: boolean;
      order: any;
    }>('/payment/verify-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
};

// Blog API
export const blogAPI = {
  getAll: async (params: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/blog?${queryString}` : '/blog';
    
    return await apiRequest<{
      blogs: any[];
      pagination: any;
    }>(endpoint);
  },

  getById: async (id: string) => {
    return await apiRequest<{ blog: any }>(`/blog/${id}`);
  },

  create: async (blogData: any) => {
    return await apiRequest<{ blog: any }>('/blog', {
      method: 'POST',
      body: JSON.stringify(blogData),
    });
  },

  update: async (id: string, blogData: any) => {
    return await apiRequest<{ blog: any }>(`/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blogData),
    });
  },

  delete: async (id: string) => {
    return await apiRequest<{ message: string }>(`/blog/${id}`, {
      method: 'DELETE',
    });
  },
};

// Admin API
export const adminAPI = {
  getDashboardStats: async () => {
    return await apiRequest<{
      totalRevenue: number;
      totalOrders: number;
      totalProducts: number;
      totalUsers: number;
      recentOrders: any[];
      salesData: any[];
      topProducts: any[];
    }>('/admin/dashboard/stats');
  },

  getSalesAnalytics: async (params: {
    period?: string;
    startDate?: string;
    endDate?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/analytics/sales?${queryString}` : '/admin/analytics/sales';
    
    return await apiRequest<{
      revenue: any[];
      orders: any[];
      products: any[];
      customers: any[];
    }>(endpoint);
  },

  getProductAnalytics: async () => {
    return await apiRequest<{
      topProducts: any[];
      categoryStats: any[];
      stockLevels: any[];
      recentlyAdded: any[];
    }>('/admin/analytics/products');
  },

  getUserAnalytics: async () => {
    return await apiRequest<{
      totalUsers: number;
      newUsers: any[];
      userTypes: any[];
      topCustomers: any[];
    }>('/admin/analytics/users');
  },

  getUsers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    userType?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users';
    
    return await apiRequest<{
      users: any[];
      pagination: any;
    }>(endpoint);
  },

  updateUser: async (id: string, userData: any) => {
    return await apiRequest<{ user: any }>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (id: string) => {
    return await apiRequest<{ message: string }>(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Category and Series Management
  getCategories: async () => {
    return await apiRequest<{ categories: any[] }>('/admin/categories');
  },

  createCategory: async (categoryData: {
    name: string;
    description?: string;
    image?: string;
  }) => {
    return await apiRequest<{ category: any }>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  updateCategory: async (id: string, categoryData: any) => {
    return await apiRequest<{ category: any }>(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  deleteCategory: async (id: string) => {
    return await apiRequest<{ message: string }>(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
  },

  getSeries: async () => {
    return await apiRequest<{ series: any[] }>('/admin/series');
  },

  createSeries: async (seriesData: {
    name: string;
    description?: string;
    image?: string;
  }) => {
    return await apiRequest<{ series: any }>('/admin/series', {
      method: 'POST',
      body: JSON.stringify(seriesData),
    });
  },

  updateSeries: async (id: string, seriesData: any) => {
    return await apiRequest<{ series: any }>(`/admin/series/${id}`, {
      method: 'PUT',
      body: JSON.stringify(seriesData),
    });
  },

  deleteSeries: async (id: string) => {
    return await apiRequest<{ message: string }>(`/admin/series/${id}`, {
      method: 'DELETE',
    });
  },

  // Site Configuration
  getSiteConfig: async () => {
    return await apiRequest<{ config: any }>('/admin/config');
  },

  updateSiteConfig: async (configData: any) => {
    return await apiRequest<{ config: any }>('/admin/config', {
      method: 'PUT',
      body: JSON.stringify(configData),
    });
  },
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file: File, folder: string = 'products') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    
    const token = localStorage.getItem('auth_token');
    
    return await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    }).then(res => res.json());
  },

  uploadMultipleImages: async (files: File[], folder: string = 'products') => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    formData.append('folder', folder);
    
    const token = localStorage.getItem('auth_token');
    
    return await fetch(`${API_BASE_URL}/upload/images`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    }).then(res => res.json());
  },

  deleteImage: async (publicId: string) => {
    return await apiRequest<{ message: string }>(`/upload/image/${publicId}`, {
      method: 'DELETE',
    });
  },
};

// Health Check API
export const healthAPI = {
  check: async () => {
    return await apiRequest<{
      status: string;
      timestamp: string;
      environment: string;
    }>('/health');
  },

  detailed: async () => {
    return await apiRequest<{
      service: string;
      uptime: number;
      database: any;
      memory: any;
      cpu: any;
    }>('/health/detailed');
  },
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    return await apiRequest<{ user: any }>('/users/profile');
  },

  updateProfile: async (profileData: any) => {
    return await apiRequest<{ user: any }>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  getAddresses: async () => {
    return await apiRequest<{ addresses: any[] }>('/users/addresses');
  },

  addAddress: async (addressData: any) => {
    return await apiRequest<{ address: any }>('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  },

  updateAddress: async (id: string, addressData: any) => {
    return await apiRequest<{ address: any }>(`/users/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  },

  deleteAddress: async (id: string) => {
    return await apiRequest<{ message: string }>(`/users/addresses/${id}`, {
      method: 'DELETE',
    });
  },

  getOrderHistory: async (params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/users/orders?${queryString}` : '/users/orders';
    
    return await apiRequest<{
      orders: any[];
      pagination: any;
    }>(endpoint);
  },
};

// Portfolio API
export const portfolioAPI = {
  getAll: async (params: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/portfolio?${queryString}` : '/portfolio';
    
    return await apiRequest<{
      projects: any[];
      pagination: any;
    }>(endpoint);
  },

  getById: async (id: string) => {
    return await apiRequest<{ project: any }>(`/portfolio/${id}`);
  },

  create: async (portfolioData: any) => {
    return await apiRequest<{ project: any }>('/portfolio', {
      method: 'POST',
      body: JSON.stringify(portfolioData),
    });
  },

  update: async (id: string, portfolioData: any) => {
    return await apiRequest<{ project: any }>(`/portfolio/${id}`, {
      method: 'PUT',
      body: JSON.stringify(portfolioData),
    });
  },

  delete: async (id: string) => {
    return await apiRequest<{ message: string }>(`/portfolio/${id}`, {
      method: 'DELETE',
    });
  },
};

// Export a centralized API object
export const api = {
  auth: authAPI,
  products: productsAPI,
  orders: ordersAPI,
  cart: cartAPI,
  wishlist: wishlistAPI,
  payment: paymentAPI,
  blog: blogAPI,
  portfolio: portfolioAPI,
  admin: adminAPI,
  upload: uploadAPI,
  health: healthAPI,
  users: usersAPI,
};

// Create aliases for backward compatibility
export const userAPI = usersAPI;

export default api;