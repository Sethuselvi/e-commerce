<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-gray-600">Loading order details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8 text-red-600">
      {{ error }}
    </div>

    <!-- Order Details -->
    <div v-else-if="order" class="space-y-6">
      <!-- Order Header -->
      <div class="bg-white border rounded-lg p-6">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold">Order #{{ order._id.slice(-6).toUpperCase() }}</h1>
            <p class="text-gray-600">Placed on {{ formatDate(order.createdAt) }}</p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-green-600">₹{{ order.totalAmount.toFixed(2) }}</div>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" :class="getStatusClass(order.status)">
              {{ order.status.charAt(0).toUpperCase() + order.status.slice(1) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Order Status Timeline -->
      <div class="bg-white border rounded-lg p-6">
        <h2 class="text-lg font-semibold mb-4">Order Status</h2>
        <div class="space-y-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-900">Order Placed</p>
              <p class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</p>
            </div>
          </div>
          
          <div class="flex items-center" :class="order.status !== 'pending' ? '' : 'opacity-50'">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="order.status !== 'pending' ? 'bg-blue-500' : 'bg-gray-300'">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-900">Processing</p>
              <p class="text-sm text-gray-500">Your order is being prepared</p>
            </div>
          </div>
          
          <div class="flex items-center" :class="['shipped', 'delivered'].includes(order.status) ? '' : 'opacity-50'">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="['shipped', 'delivered'].includes(order.status) ? 'bg-purple-500' : 'bg-gray-300'">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-900">Shipped</p>
              <p class="text-sm text-gray-500" v-if="order.trackingNumber">Tracking: {{ order.trackingNumber }}</p>
              <p class="text-sm text-gray-500" v-else>Your order is on its way</p>
            </div>
          </div>
          
          <div class="flex items-center" :class="order.status === 'delivered' ? '' : 'opacity-50'">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-900">Delivered</p>
              <p class="text-sm text-gray-500">Your order has been delivered</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div class="bg-white border rounded-lg p-6">
        <h2 class="text-lg font-semibold mb-4">Order Items</h2>
        <div class="space-y-4">
          <div v-for="item in order.items" :key="item._id" class="flex items-center space-x-4">
            <div>
              <img v-if="item.image" :src="item.image" :alt="item.name" class="w-20 h-20 object-cover rounded" />
            </div>
            <div class="flex-grow">
              <h4 class="font-semibold">{{ item.name }}</h4>
              <p class="text-sm text-gray-600">Quantity: {{ item.quantity }}</p>
              <p class="text-sm text-gray-600">₹{{ item.price.toFixed(2) }} each</p>
            </div>
            <div class="text-right">
              <p class="font-medium">₹{{ (item.price * item.quantity).toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="bg-white border rounded-lg p-6">
        <h2 class="text-lg font-semibold mb-4">Order Summary</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{{ order.subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Shipping:</span>
            <span>₹{{ order.shippingCost.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Tax:</span>
            <span>₹{{ order.tax.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total:</span>
            <span>₹{{ order.totalAmount.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Shipping Information -->
      <div class="bg-white border rounded-lg p-6">
        <h2 class="text-lg font-semibold mb-4">Shipping Information</h2>
        <div class="space-y-2">
          <p><strong>Name:</strong> {{ order.customerName }}</p>
          <p><strong>Email:</strong> {{ order.customerEmail }}</p>
          <p><strong>Phone:</strong> {{ order.customerPhone }}</p>
          <div class="mt-4">
            <p><strong>Address:</strong></p>
            <p>{{ order.shippingAddress.street }}</p>
            <p>{{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.zipCode }}</p>
            <p>{{ order.shippingAddress.country }}</p>
          </div>
        </div>
      </div>

      <!-- Back to Orders -->
      <div class="text-center">
        <router-link 
          to="/orders"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          ← Back to My Orders
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/services/api'

interface OrderItem {
  _id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface ShippingAddress {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface Order {
  _id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  tax: number
  totalAmount: number
  status: string
  trackingNumber?: string
  shippingAddress: ShippingAddress
  createdAt: string
}

const route = useRoute()
const order = ref<Order | null>(null)
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

const fetchOrderDetails = async () => {
  try {
    loading.value = true
    error.value = ''
    const orderId = route.params.id as string
    const response = await api.getCustomerOrder(orderId)
    order.value = response
  } catch (err) {
    console.error('Error fetching order details:', err)
    error.value = 'Failed to load order details. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrderDetails()
})
</script> 