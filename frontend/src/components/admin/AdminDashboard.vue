<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Orders</h3>
        <p class="stat-number">{{ stats.totalOrders }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Revenue</h3>
        <p class="stat-number">₹{{ stats.totalRevenue }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Users</h3>
        <p class="stat-number">{{ stats.totalUsers }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Products</h3>
        <p class="stat-number">{{ stats.totalProducts }}</p>
      </div>
    </div>

    <div class="recent-activity">
      <h2>Recent Orders</h2>
      <div class="orders-list">
        <div v-for="order in recentOrders" :key="order._id" class="order-item">
          <div class="order-info">
            <span class="order-id">#{{ order._id.slice(-6) }}</span>
            <span class="order-status" :class="order.status">{{ order.status }}</span>
          </div>
          <div class="order-details">
            <span class="order-amount">₹{{ order.totalAmount }}</span>
            <span class="order-date">{{ formatDate(order.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'

interface Stats {
  totalOrders: number
  totalRevenue: number
  totalUsers: number
  totalProducts: number
}

interface Order {
  _id: string
  totalAmount: number
  status: string
  createdAt: string
}

const stats = ref<Stats>({
  totalOrders: 0,
  totalRevenue: 0,
  totalUsers: 0,
  totalProducts: 0
})

const recentOrders = ref<Order[]>([])
const loading = ref(false)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const fetchDashboardData = async () => {
  try {
    loading.value = true
    const response = await api.getDashboardStats()
    stats.value = {
      totalOrders: response.totalOrders,
      totalRevenue: response.totalRevenue,
      totalUsers: response.totalUsers,
      totalProducts: response.totalProducts
    }
    recentOrders.value = response.recentOrders || []
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    alert('Failed to fetch dashboard data')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.recent-activity {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.recent-activity h2 {
  margin: 0 0 1rem 0;
  color: #333;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
}

.order-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.order-id {
  font-weight: bold;
  color: #333;
}

.order-status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.order-status.pending {
  background: #fff3cd;
  color: #856404;
}

.order-status.shipped {
  background: #d1ecf1;
  color: #0c5460;
}

.order-status.delivered {
  background: #d4edda;
  color: #155724;
}

.order-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.order-amount {
  font-weight: bold;
  color: #333;
}

.order-date {
  font-size: 0.8rem;
  color: #666;
}
</style> 