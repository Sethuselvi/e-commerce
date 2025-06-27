<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-8">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-2 text-gray-600">Loading profile...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="text-center py-8">
              <div class="text-red-600 mb-4">{{ error }}</div>
              <button
                @click="fetchProfile"
                class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>

            <!-- Profile Content -->
            <div v-else-if="user" class="space-y-6">
              <div>
                <h2 class="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Name</label>
                    <p class="mt-1 text-gray-900">{{ user.name }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <p class="mt-1 text-gray-900">{{ user.email }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/services/api'
import type { User } from '@/types/user'

const auth = useAuthStore()
const user = ref<User | null>(null)
const loading = ref(true)
const error = ref('')

const fetchProfile = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await api.getUserProfile()
    user.value = response
  } catch (err: any) {
    console.error('Profile error:', err)
    error.value = err.response?.data?.message || 'Failed to load profile'
    if (error.value === 'No token provided' || error.value === 'Invalid token') {
      auth.logout()
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script> 