<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted } from 'vue'
import Navbar from '@/components/common/Navbar.vue'
import Cart from '@/components/common/Cart.vue'

// Create reactive state for cart visibility
const isCartOpen = ref(false)

// Provide the cart state to child components
provide('isCartOpen', isCartOpen)

// Handle click outside to close cart
const handleClickOutside = (event: MouseEvent) => {
  const cartElement = document.querySelector('.cart-dropdown')
  const navbarElement = document.querySelector('.navbar-cart-button')
  
  if (isCartOpen.value && cartElement && navbarElement) {
    if (!cartElement.contains(event.target as Node) && !navbarElement.contains(event.target as Node)) {
      isCartOpen.value = false
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div>
    <Navbar />
    <main class="container mx-auto px-4 py-8">
      <router-view></router-view>
    </main>
    <Cart v-if="isCartOpen" :isOpen="isCartOpen" class="cart-dropdown" @close="isCartOpen = false" />
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
