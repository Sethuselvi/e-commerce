import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface Product {
  _id: string
  name: string
  price: number
  description: string
  category: string
  image: string
  stock: number
  rating: {
    rate: number
    count: number
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export const api = {
  // Product endpoints
  async getProducts(): Promise<Product[]> {
    const response = await apiClient.get('/products')
    return response.data
  },

  async getCategories(): Promise<string[]> {
    const response = await apiClient.get('/products/categories')
    return response.data
  },

  // Admin Product endpoints
  async getAdminProducts() {
    const response = await apiClient.get('/admin/products')
    return response.data
  },

  async createProduct(productData: any) {
    const response = await apiClient.post('/admin/products', productData)
    return response.data
  },

  async updateProduct(productId: string, productData: any) {
    const response = await apiClient.put(`/admin/products/${productId}`, productData)
    return response.data
  },

  async deleteProduct(productId: string): Promise<void> {
    await apiClient.delete(`/admin/products/${productId}`);
  },

  async uploadImage(file: File): Promise<{ filePath: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Admin Order endpoints
  async getAdminOrders() {
    const response = await apiClient.get('/admin/orders')
    return response.data
  },

  async getAdminOrder(orderId: string) {
    const response = await apiClient.get(`/admin/orders/${orderId}`)
    return response.data
  },

  async updateOrderStatus(orderId: string, status: string) {
    const response = await apiClient.put(`/admin/orders/${orderId}`, { status })
    return response.data
  },

  async getDashboardStats() {
    const response = await apiClient.get('/admin/orders/dashboard/stats')
    return response.data
  },

  // Customer Order endpoints
  async getCustomerOrders() {
    const response = await apiClient.get('/orders')
    return response.data
  },

  async getCustomerOrder(orderId: string) {
    const response = await apiClient.get(`/orders/${orderId}`)
    return response.data
  },

  // Auth endpoints
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      return response.data
    } catch (error) {
      throw new Error('Invalid credentials')
    }
  },

  async register(userData: RegisterData): Promise<User> {
    try {
      const response = await apiClient.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw new Error('Registration failed')
    }
  },

  async getUserProfile(): Promise<User> {
    try {
      const response = await apiClient.get('/auth/profile')
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch user profile')
    }
  },

  // Clear auth token from axios instance
  clearAuthToken() {
    delete apiClient.defaults.headers.common['Authorization']
  }
} 