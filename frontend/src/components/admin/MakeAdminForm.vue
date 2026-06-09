<template>
  <div class="make-admin-container">
    <div class="card">
      <h2>Make User Admin</h2>
      <p class="description">Enter an email address to promote a user to admin</p>
      
      <form @submit.prevent="handleMakeAdmin">
        <div class="form-group">
          <label for="email">User Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter email address"
            required
            class="form-input"
          />
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="btn-submit"
        >
          <span v-if="loading">Processing...</span>
          <span v-else>Make Admin</span>
        </button>
      </form>

      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { api } from '@/services/api'

const email = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const handleMakeAdmin = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    const response = await fetch('http://localhost:5001/api/auth/make-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email.value })
    })

    const data = await response.json()

    if (!response.ok) {
      errorMessage.value = data.message || 'Failed to make user admin'
      return
    }

    successMessage.value = `✓ ${data.user.name} (${data.user.email}) is now an admin`
    email.value = ''
  } catch (error: any) {
    errorMessage.value = error.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.make-admin-container {
  padding: 20px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  max-width: 500px;
}

h2 {
  color: #333;
  margin-bottom: 10px;
  font-size: 24px;
}

.description {
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-submit:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.alert {
  margin-top: 15px;
  padding: 12px;
  border-radius: 4px;
  font-size: 14px;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
