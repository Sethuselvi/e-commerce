import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Profile from '@/pages/Profile.vue'
import Checkout from '@/pages/Checkout.vue'
import OrderSuccess from '@/views/OrderSuccess.vue'
import OrderHistory from '@/pages/OrderHistory.vue'
import OrderDetails from '@/pages/OrderDetails.vue'
import AdminLayout from '@/components/admin/AdminLayout.vue'
import AdminDashboard from '@/components/admin/AdminDashboard.vue'
import AdminProducts from '@/components/admin/AdminProducts.vue'
import AdminOrders from '@/components/admin/AdminOrders.vue'
import ForgotPassword from '@/components/auth/ForgotPassword.vue'
import ResetPassword from '@/components/auth/ResetPassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout,
      meta: { requiresAuth: true }
    },
    {
      path: '/order-success',
      name: 'order-success',
      component: OrderSuccess
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrderHistory,
      meta: { requiresAuth: true }
    },
    {
      path: '/orders/:id',
      name: 'order-details',
      component: OrderDetails,
      meta: { requiresAuth: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassword
    },
    {
      path: '/reset-password/:token',
      name: 'reset-password-token',
      component: ResetPassword
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard'
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: AdminDashboard
        },
        {
          path: 'products',
          name: 'admin-products',
          component: AdminProducts
        },
        {
          path: 'orders',
          name: 'admin-orders',
          component: AdminOrders
        }
      ]
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.requiresAdmin) {
    // Check if user is admin
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (!user.isAdmin) {
        next('/')
        return
      }
    } catch (error) {
      next('/')
      return
    }
    next()
  } else {
    next()
  }
})

export default router