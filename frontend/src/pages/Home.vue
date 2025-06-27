<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold mb-4">Product Catalog</h1>
      
      <!-- Search and Filter Section -->
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <div class="flex-1">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="searchQuery"
          />
        </div>
        <div class="w-full md:w-48">
          <select
            v-model="selectedCategory"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="selectedCategory"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category.charAt(0).toUpperCase() + category.slice(1) }}
            </option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="mt-2 text-gray-600">Loading products...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-8 text-red-600">
        {{ error }}
      </div>

      <!-- No Results -->
      <div v-else-if="filteredProducts.length === 0" class="text-center py-8 text-gray-600">
        No products found matching your search criteria.
      </div>

      <!-- Products Grid -->
      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProductCard
            v-for="product in paginatedProducts"
            :key="product._id"
            :product="product"
          />
        </div>

        <!-- Pagination -->
        <div class="mt-6 flex justify-center items-center gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-4 py-2 border rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span class="px-4 py-2">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import ProductCard from '@/components/common/ProductCard.vue'
import { api } from '../services/api'
import type { Product } from '../types/user'

const products = ref<Product[]>([])
const categories = ref<string[]>([])
const loading = ref(true)
const error = ref('')
const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const itemsPerPage = 6

// Fetch products and categories
const fetchData = async () => {
  try {
    loading.value = true
    error.value = ''
    const [productsData, categoriesData] = await Promise.all([
      api.getProducts(),
      api.getCategories()
    ])
    products.value = productsData
    categories.value = categoriesData
  } catch (err) {
    error.value = 'Failed to load products. Please try again later.'
    console.error('Error fetching data:', err)
  } finally {
    loading.value = false
  }
}

// Filter products based on search query and category
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

// Reset pagination when filters change
watch([searchQuery, selectedCategory], () => {
  currentPage.value = 1
})

onMounted(() => {
  fetchData()
})
</script>