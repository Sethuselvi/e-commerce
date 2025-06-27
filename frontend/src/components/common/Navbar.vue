<template>
  <nav class="bg-white shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0 flex items-center">
            <img class="h-8 w-auto" src="@/assets/images/logo.svg" alt="Logo" />
            <span class="ml-2 text-xl font-bold text-gray-900">E-Commerce</span>
          </router-link>
        </div>

        <div class="flex items-center space-x-4">
          <div class="relative">
            <button 
              @click="toggleCart"
              class="navbar-cart-button cursor-pointer text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <img src="@/assets/images/cart-icon.svg" alt="Cart" class="w-5 h-5 mr-1" />
              Cart ({{ cartItemCount }})
            </button>
          </div>

          <div v-if="!isAuthenticated" class="flex items-center space-x-2">
            <router-link 
              to="/login" 
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Register
            </router-link>
          </div>

          <div v-else class="flex items-center space-x-2">
            <router-link 
              to="/profile" 
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              {{ authStore.user?.name }}
            </router-link>
            
            <!-- Customer Links -->
            <div v-if="!authStore.user?.isAdmin" class="flex items-center space-x-2">
              <router-link 
                to="/orders" 
                class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                My Orders
              </router-link>
            </div>
            
            <!-- Admin Links -->
            <div v-if="authStore.user?.isAdmin" class="flex items-center space-x-2">
              <router-link 
                to="/admin/dashboard" 
                class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Admin
              </router-link>
            </div>
            
            <button 
              @click="logout"
              class="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const isCartOpen = inject('isCartOpen') as Ref<boolean>

const isAuthenticated = computed(() => authStore.isAuthenticated)
const cartItemCount = computed(() => cartStore.cartCount)

const logout = () => {
  authStore.logout()
  router.push('/login')
}

const toggleCart = () => {
  isCartOpen.value = !isCartOpen.value
}
</script> 