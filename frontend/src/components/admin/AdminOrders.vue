<template>
  <div class="admin-orders">
    <h1>Order Management</h1>
    
    <div class="orders-table">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Products</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order._id">
            <td>#{{ order._id.slice(-6) }}</td>
            <td>{{ order.customerName }}</td>
            <td>{{ order.items.length }} items</td>
            <td>₹{{ order.totalAmount }}</td>
            <td>
              <select 
                v-model="order.status" 
                @change="updateOrderStatus(order._id, order.status)"
                :class="getStatusClass(order.status)"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>
              <button @click="viewOrderDetails(order)" class="view-btn">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Order Details Modal -->
    <div v-if="selectedOrder" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Order Details</h2>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        
        <div class="order-details">
          <div class="customer-info">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> {{ selectedOrder.customerName }}</p>
            <p><strong>Email:</strong> {{ selectedOrder.customerEmail }}</p>
            <p><strong>Phone:</strong> {{ selectedOrder.customerPhone }}</p>
          </div>
          
          <div class="shipping-info">
            <h3>Shipping Address</h3>
            <p>{{ selectedOrder.shippingAddress.street }}</p>
            <p>{{ selectedOrder.shippingAddress.city }}, {{ selectedOrder.shippingAddress.state }} {{ selectedOrder.shippingAddress.zipCode }}</p>
            <p>{{ selectedOrder.shippingAddress.country }}</p>
          </div>
          
          <div class="order-items">
            <h3>Order Items</h3>
            <div class="items-list">
              <div v-for="item in selectedOrder.items" :key="item._id" class="item">
                <div class="item-details">
                  <div class="item-info">
                    <img v-if="item.image" :src="item.image" :alt="item.name" class="item-image" />
                    <span>{{ item.name }}</span>
                    <span>(x{{ item.quantity }})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="order-summary">
            <h3>Order Summary</h3>
            <p><strong>Subtotal:</strong> ₹{{ selectedOrder.subtotal }}</p>
            <p><strong>Shipping:</strong> ₹{{ selectedOrder.shippingCost }}</p>
            <p><strong>Tax:</strong> ₹{{ selectedOrder.tax }}</p>
            <p><strong>Total:</strong> ₹{{ selectedOrder.totalAmount }}</p>
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
  shippingAddress: ShippingAddress
  createdAt: string
}

const orders = ref<Order[]>([])
const selectedOrder = ref<Order | null>(null)
const loading = ref(false)

const fetchOrders = async () => {
  try {
    loading.value = true
    const response = await api.getAdminOrders()
    orders.value = response
  } catch (error) {
    console.error('Error fetching orders:', error)
    alert('Failed to fetch orders')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const getStatusClass = (status: string) => {
  return `status-${status}`
}

const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    await api.updateOrderStatus(orderId, newStatus)
    // Optionally refresh the orders list
    await fetchOrders()
  } catch (error) {
    console.error('Error updating order status:', error)
    alert('Failed to update order status')
  }
}

const viewOrderDetails = (order: Order) => {
  selectedOrder.value = order
}

const closeModal = () => {
  selectedOrder.value = null
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.admin-orders {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.orders-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background: #f8f9fa;
  font-weight: bold;
}

select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-processing {
  background: #cce5ff;
  color: #004085;
}

.status-shipped {
  background: #d1ecf1;
  color: #0c5460;
}

.status-delivered {
  background: #d4edda;
  color: #155724;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.view-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.order-details {
  padding: 1.5rem;
}

.customer-info,
.shipping-info,
.order-items,
.order-summary {
  margin-bottom: 2rem;
}

.customer-info h3,
.shipping-info h3,
.order-items h3,
.order-summary h3 {
  margin-bottom: 1rem;
  color: #333;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.item-details h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.item-details p {
  margin: 0.25rem 0;
  color: #666;
}

.order-summary p {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
}

.order-summary p:last-child {
  font-weight: bold;
  font-size: 1.1rem;
  border-top: 1px solid #eee;
  padding-top: 0.5rem;
  margin-top: 1rem;
}
</style> 