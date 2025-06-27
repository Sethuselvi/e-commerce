import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/services/api'

interface CartItem extends Product {
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const cart = ref<CartItem[]>([])

  function addToCart(product: Product) {
    const found = cart.value.find(p => p._id === product._id)
    if (found) {
      found.quantity++
    } else {
      cart.value.push({ ...product, quantity: 1 })
    }
  }

  function increaseQuantity(id: string) {
    const found = cart.value.find(p => p._id === id)
    if (found) {
      found.quantity++
    }
  }

  function decreaseQuantity(id: string) {
    const found = cart.value.find(p => p._id === id)
    if (found) {
      if (found.quantity > 1) {
        found.quantity--
      } else {
        removeFromCart(id)
      }
    }
  }

  function removeFromCart(id: string) {
    cart.value = cart.value.filter(p => p._id !== id)
  }

  function clearCart() {
    cart.value = []
  }

  const cartTotal = computed(() =>
    cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
  )

  const cartCount = computed(() =>
    cart.value.reduce((count, item) => count + item.quantity, 0)
  )

  return {
    cart,
    cartTotal,
    cartCount,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart
  }
})