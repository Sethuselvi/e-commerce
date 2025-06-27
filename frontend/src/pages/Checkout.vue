<template>
  <div class="max-w-4xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Checkout</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Order Summary -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
        <div v-for="item in cart.cart" :key="item._id" class="flex justify-between py-2 border-b">
          <div>
            <h3 class="font-medium">{{ item.name }}</h3>
            <p class="text-sm text-gray-600">Quantity: {{ item.quantity }}</p>
          </div>
          <span class="font-medium">₹{{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
        
        <div class="mt-4 pt-4 border-t">
          <div class="flex justify-between items-center font-bold">
            <span>Total:</span>
            <span>₹{{ cart.cartTotal.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Payment Form -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Payment Details</h2>
        <form @submit.prevent="handlePayment" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Card Number</label>
            <input 
              type="text" 
              v-model="cardNumber"
              class="border border-black mt-1 block w-full rounded-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-300"
              placeholder="1234 5678 9012 3456"
              name="cardNumber"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium">Expiry Date</label>
              <input 
                type="text" 
                v-model="expiryDate"
                class="border border-black mt-1 block w-full rounded-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-300"
                placeholder="MM/YY"
                name="expiryDate"
              />
            </div>
            <div>
              <label class="block text-sm font-medium ">CVV</label>
              <input 
                type="password" 
                v-model="cvv"
                class="border border-black mt-1 block w-full rounded-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-300"
                name="cvv"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium">Name on Card</label>
            <input 
              type="text" 
              v-model="cardName"
              class="border border-black mt-1 block w-full rounded-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder:text-gray-300"
              placeholder="John Doe"
              name="cardName"
            />
          </div>

          <button 
            type="submit"
            :disabled="isProcessing"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {{ isProcessing ? 'Processing...' : `Pay ₹${cart.cartTotal.toFixed(2)}` }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

// Add Razorpay type definition
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const cart = useCartStore()
const auth = useAuthStore()
const router = useRouter()

const cardNumber = ref('')
const expiryDate = ref('')
const cvv = ref('')
const cardName = ref('')
const isProcessing = ref(false)


const handlePayment = async () => {
  if (!cardNumber.value || !expiryDate.value || !cvv.value || !cardName.value) {
    alert('Please fill in all payment details')
    return
  }

  try {
    isProcessing.value = true
    
    // Get the auth token from localStorage
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Authentication required')
    }

    // Get the current user from localStorage
    const storedUser = localStorage.getItem('user')
    const currentUser = storedUser ? JSON.parse(storedUser) : null
    

    
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/checkout/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: Math.round(cart.cartTotal * 100), // Convert to paise and ensure it's an integer
      }),
    })

    
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Server error details:', errorData)
      throw new Error(errorData.message || `Server error: ${response.status}`)
    }

    const responseText = await response.text()
    

    if (!responseText) {
      throw new Error('Empty response from server')
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error('Failed to parse response:', e)
      throw new Error('Invalid response from server')
    }

    if (!data.id) {
      console.error('Invalid order data:', data)
      throw new Error('Invalid order data received')
    }

    // Check if Razorpay is loaded
    if (typeof window.Razorpay === 'undefined') {
      throw new Error('Razorpay SDK not loaded. Please refresh the page and try again.')
    }

    
    
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID 
   
    
    if (!razorpayKey) {
      throw new Error('Razorpay key is not configured. Please check your environment variables.')
    }

    

    // Initialize Razorpay payment
    const options = {
      key: razorpayKey,
      amount: data.amount,
      currency: data.currency,
      order_id: data.id,
      name: 'E-Commerce Store',
      description: 'Payment for your order',
      handler: async function (response: RazorpayResponse) {
        try {
          
          
          // Prepare order details for database
          const orderDetails = {
            customerName: currentUser?.name || auth.user?.name || 'N/A',
            customerEmail: currentUser?.email || auth.user?.email || '',
            customerPhone: '9845577623', // TODO: Add phone field to user profile
            items: cart.cart.map(item => ({
              productId: item._id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image
            })),
            subtotal: cart.cartTotal,
            shippingCost: 10.00, // Fixed shipping cost
            tax: cart.cartTotal * 0.08, // 8% tax
            totalAmount: cart.cartTotal + 10.00 + (cart.cartTotal * 0.08),
            shippingAddress: {
              street: '123 Main St', // TODO: Add address fields to user profile and collect from user during checkout
              city: 'Chennai',
              state: 'TamilNadu',
              zipCode: '600093',
              country: 'India'
            }
          }

         
          // Verify payment with backend and save order
          const verifyResponse = await fetch('http://localhost:5001/api/checkout/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderDetails: orderDetails
            })
          })

          const verifyData = await verifyResponse.json()
          
          if (verifyData.success) {
           
            const finalAmount = cart.cartTotal
            cart.clearCart()
           
            
            // Get the current user's name
            const userName = currentUser?.name || auth.user?.name || 'N/A'
          
            
            router.push({
              name: 'order-success',
              query: {
                orderId: verifyData.orderId, // Use the database order ID
                amount: finalAmount.toString(),
                customerName: userName,
                customerEmail: currentUser?.email || auth.user?.email,
                paymentId: response.razorpay_payment_id,
                paymentTime: new Date().toISOString()
              }
            })
          } else {
            throw new Error(verifyData.message || 'Failed to save order')
          }
        } catch (error) {
          console.error('Error saving order:', error)
          alert('Payment successful but order could not be saved. Please contact support.')
        }
      },
      prefill: {
        name: currentUser?.name || auth.user?.name || '',
        email: currentUser?.email || auth.user?.email || '',
      },
      theme: {
        color: '#2563eb'
      }
    }

    try {
    
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error('Razorpay initialization error:', error)
      throw new Error('Failed to initialize payment. Please try again.')
    }
  } catch (error: unknown) {
    console.error('Payment error:', error)
    alert(error instanceof Error ? error.message : 'Payment failed. Please try again.')
  } finally {
    isProcessing.value = false
  }
}
</script>