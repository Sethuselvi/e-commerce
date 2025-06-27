export interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
}

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

export interface AuthResponse {
  token: string
  user: User
} 