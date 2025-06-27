<template>
  <div class="max-w-6xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">My Orders</h1>
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-gray-600">Loading your orders...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8 text-red-600">
      {{ error }}
    </div>

    <!-- No Orders -->
    <div v-else-if="orders.length === 0" class="text-center py-8">
      <div class="text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
        <p class="mt-1 text-sm text-gray-500">Start shopping to see your orders here.</p>
        <div class="mt-6">
          <router-link to="/" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            Start Shopping
          </router-link>
        </div>
      </div>
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-6">
      <div v-for="order in orders" :key="order._id" class="bg-white border rounded-lg shadow-sm">
        <!-- Order Header -->
        <div class="p-6 border-b">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold">Order #{{ order._id.slice(-6).toUpperCase() }}</h3>
              <p class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold">₹{{ order.totalAmount.toFixed(2) }}</div>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getStatusClass(order.status)">
                {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="item in order.items" :key="item._id" class="flex items-center space-x-3">
              <img v-if="item.image" :src="item.image" :alt="item.name" class="w-16 h-16 object-cover rounded" />
              <div>
                <p class="font-medium">{{ item.name }}</p>
                <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
              </div>
              <div class="text-right">
                <p class="font-medium">₹{{ (item.price * item.quantity).toFixed(2) }}</p>
              </div>
            </div>
          </div>

          <!-- Order Actions -->
          <div class="mt-6 flex justify-between items-center">
            <div class="text-sm text-gray-600">
              <p>Items: {{ order.items.length }}</p>
              <p v-if="order.trackingNumber">Tracking: {{ order.trackingNumber }}</p>
            </div>
            <router-link 
              :to="`/orders/${order._id}`"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'

interface OrderItem {
  _id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  _id: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  tax: number
  totalAmount: number
  status: string
  trackingNumber?: string
  createdAt: string
}

const orders = ref<Order[]>([])
const loading = ref(true)
const error = ref('')

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status: string) => {
  const statusClasses = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
}

const fetchOrders = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await api.getCustomerOrders()
    orders.value = response
  } catch (err) {
    console.error('Error fetching orders:', err)
    error.value = 'Failed to load orders. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})
</script> 