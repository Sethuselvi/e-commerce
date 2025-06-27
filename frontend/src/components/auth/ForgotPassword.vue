<template>
  <div class="flex items-center justify-center py-18 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Forgot your password?
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span v-if="loading">Sending...</span>
            <span v-else>Send Reset Link</span>
          </button>
        </div>

        <div v-if="error" class="text-red-600 text-center">
          {{ error }}
        </div>
        <div v-if="success" class="text-green-600 text-center">
          {{ success }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = '';
    success.value = '';
    
    await axios.post('http://localhost:5001/api/auth/forgot-password', {
      email: email.value
    });
    
    success.value = 'Password reset link has been sent to your email';
    email.value = '';
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred';
  } finally {
    loading.value = false;
  }
};
</script> 