<template>
  <div
    :class="[
      'fixed top-0 right-0 w-[400px] h-screen bg-white shadow-lg transition-all duration-300 z-[1000]',
      isOpen ? 'right-0' : '-right-[400px]'
    ]"
  >
    <div class="p-6 h-full overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold">Shopping Cart</h2>
        <button @click="closeCart" class="text-gray-500 hover:text-gray-700 text-2xl leading-none cursor-pointer">&times;</button>
      </div>

      <div v-if="cart.cart.length > 0">
        <ul class="divide-y divide-gray-200">
          <div v-for="item in cart.cart" :key="item._id" class="flex items-center justify-between py-2 border-b">
            <div class="flex items-center gap-3">
              <ProductImage
                :src="item.image"
                :alt="item.name"
                class="w-12 h-12 object-cover rounded"
              />
              <div>
                <h3 class="font-medium text-sm">{{ item.name }}</h3>
                <p class="text-xs text-gray-500">₹{{ item.price.toFixed(2) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button @click="cart.decreaseQuantity(item._id)" class="px-2 py-0.5 text-sm bg-gray-200 rounded">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="cart.addToCart(item)" class="px-2 py-0.5 text-sm bg-gray-200 rounded">+</button>
            </div>
            <button @click="cart.removeFromCart(item._id)" class="text-red-500 hover:text-red-700">
              Remove
            </button>
          </div>
        </ul>
        <div class="mt-6 text-right">
          <p class="text-lg font-semibold">Total: ₹{{ cart.cartTotal.toFixed(2) }}</p>
        </div>
        <button 
          @click="closeCartAndCheckout" 
          class="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 cursor-pointer"
        >
          Checkout
        </button>
      </div>
      <div v-else class="text-center py-8 text-gray-500">
        Your cart is empty
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'
import ProductImage from './ProductImage.vue'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const cart = useCartStore()
const router = useRouter()

const closeCart = () => {
  emit('close')
}

const closeCartAndCheckout = () => {
  closeCart()
  router.push('/checkout')
}
</script>