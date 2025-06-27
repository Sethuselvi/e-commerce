<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white shadow-lg rounded-lg p-8 text-center">
        <div class="mb-6">
          <svg class="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Order Successful!</h1>
        <p class="text-lg text-gray-600 mb-8">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        
        <div class="space-y-4">
          <p class="text-gray-700">
            Order ID: <span class="font-semibold">{{ orderId }}</span>
          </p>
          <p class="text-gray-700">
            Total Amount: <span class="font-semibold">₹{{ totalAmount.toFixed(2) }}</span>
          </p>
        </div>

        <div class="mt-8 space-x-4">
          <router-link 
            to="/"
            class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </router-link>
          <button 
            @click="downloadInvoice"
            class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import jsPDF from 'jspdf'

const route = useRoute()
const orderId = ref('')
const totalAmount = ref(0)
const orderDate = ref('')
const customerName = ref('')
const customerEmail = ref('')
const paymentId = ref('')
const paymentTime = ref('')

onMounted(() => {
  // Get order details from route params or query
  orderId.value = route.query.orderId as string || 'N/A'
  totalAmount.value = parseFloat(route.query.amount as string) || 0
  customerName.value = route.query.customerName as string || 'N/A'
  customerEmail.value = route.query.customerEmail as string || 'N/A'
  paymentId.value = route.query.paymentId as string || 'N/A'
  paymentTime.value = route.query.paymentTime as string || new Date().toISOString()
  orderDate.value = new Date(paymentTime.value).toLocaleString()
})

const downloadInvoice = () => {
  // Create new PDF document
  const doc = new jsPDF()
  
  // Add company logo or name
  doc.setFontSize(20)
  doc.text('E-Commerce Store', 105, 20, { align: 'center' })
  
  // Add invoice title
  doc.setFontSize(16)
  doc.text('INVOICE', 105, 30, { align: 'center' })
  
  // Add order details
  doc.setFontSize(12)
  doc.text(`Order ID: ${orderId.value}`, 20, 45)
  doc.text(`Date: ${orderDate.value}`, 20, 55)
  
  // Add customer details
  doc.text('Customer Details:', 20, 70)
  doc.text(`Name: ${customerName.value}`, 20, 80)
  doc.text(`Email: ${customerEmail.value}`, 20, 90)
  
  // Add order summary
  doc.text('Order Summary:', 20, 110)
  doc.text(`Total Amount: ₹${totalAmount.value.toFixed(2)}`, 20, 120)
  
  // Add payment details
  doc.text('Payment Details:', 20, 140)
  doc.text('Payment Method: Razorpay', 20, 150)
  doc.text(`Transaction ID: ${paymentId.value}`, 20, 160)
  doc.text(`Payment Time: ${orderDate.value}`, 20, 170)
  
  // Add footer
  doc.setFontSize(10)
  doc.text('Thank you for your business!', 105, 280, { align: 'center' })
  
  // Save the PDF
  doc.save(`invoice-${orderId.value}.pdf`)
}
</script> 