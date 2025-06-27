<template>
  <div class="border p-4 rounded shadow hover:shadow-lg transition-shadow">
    <ProductImage
      :src="product.image"
      :alt="product.name"
      class="w-full h-40 object-contain"
    />
    <h2 class="text-lg font-semibold mt-2 line-clamp-1">{{ product.name }}</h2>
    <p class="text-sm text-gray-600 line-clamp-2">{{ product.description }}</p>
    <div class="flex justify-between items-center mt-2">
      <div>
        <span class="font-bold">₹{{ product.price.toFixed(2) }}</span>
      </div>
      <div class="flex items-center gap-2">
        <button 
          @click="handleDecrease"
          class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 cursor-pointer transition-colors"
        >
          -
        </button>
        <span class="font-medium">{{ cartItem?.quantity || 0 }}</span>
        <button 
          @click="handleAdd"
          class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 cursor-pointer transition-colors"
        >
          +
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'
import { computed } from 'vue'
import type { Product } from '@/services/api'
import ProductImage from './ProductImage.vue'

const props = defineProps<{ product: Product }>()
const cart = useCartStore()

const cartItem = computed(() => {
  return cart.cart.find(item => item._id === props.product._id)
})

const handleAdd = () => {
  cart.addToCart(props.product)
}

const handleDecrease = () => {
  if (cartItem.value) {
    cart.decreaseQuantity(props.product._id)
  }
}
</script>