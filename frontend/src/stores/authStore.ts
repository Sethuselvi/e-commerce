import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'
import type { User, RegisterData } from '@/types/user'
import type { LoginData } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  // Clear all auth data
  function clearAuthData() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    api.clearAuthToken()
  }

  async function login(credentials: LoginData) {
    try {
      const response = await api.login(credentials.email, credentials.password)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
    } catch (error) {
      clearAuthData() // Clear any existing data on login failure
      throw new Error('Invalid credentials')
    }
  }

  async function register(userData: RegisterData) {
    try {
      const newUser = await api.register(userData)
      user.value = newUser
      // Auto login after registration
      await login({ email: userData.email, password: userData.password })
    } catch (error) {
      clearAuthData() // Clear any existing data on registration failure
      throw new Error('Registration failed')
    }
  }

  function logout() {
    clearAuthData()
  }

  // Initialize auth state from localStorage
  const storedToken = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')
  
  if (storedToken && storedUser) {
    try {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    } catch (error) {
      // If there's any error parsing the stored data, clear everything
      clearAuthData()
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    clearAuthData
  }
}) 