<template>
  <div class="admin-products">
    <div class="header">
      <h1>Product Management</h1>
      <button @click="showAddForm = true" class="add-btn">Add New Product</button>
    </div>

    <!-- Add/Edit Product Form -->
    <div v-if="showAddForm || editingProduct" class="form-overlay">
      <div class="form-container">
        <h2>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h2>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">Product Name</label>
            <input 
              id="name"
              v-model="productForm.name" 
              type="text" 
              required
            />
          </div>
          
          <div class="form-group">
            <label for="price">Price</label>
            <input 
              id="price"
              v-model="productForm.price" 
              type="number" 
              step="0.01" 
              required
            />
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description"
              v-model="productForm.description" 
              rows="3"
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>Product Image</label>
            <div>
              <label 
                for="image-upload" 
                class="file-upload-label"
                :class="{ 'disabled': uploading }"
              >
                {{ uploading ? 'Uploading...' : 'Choose File' }}
              </label>
              <input 
                id="image-upload"
                type="file" 
                @change="handleImageUpload"
                accept="image/*"
                class="file-upload-input"
                :disabled="uploading"
              />
            </div>

            <div v-if="productForm.image" class="image-preview">
              <img :src="productForm.image" alt="Product preview" />
            </div>
            
            <div v-if="uploadError" class="upload-error">
              {{ uploadError }}
            </div>
          </div>
          
          <div class="form-group">
            <label for="category">Category</label>
            <input 
              id="category"
              v-model="productForm.category" 
              type="text" 
              required
            />
          </div>
          
          <div class="form-group">
            <label for="stock">Stock Quantity</label>
            <input 
              id="stock"
              v-model="productForm.stock" 
              type="number" 
              required
            />
          </div>
          
          <div class="form-actions">
            <button type="button" @click="cancelForm" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">
              {{ editingProduct ? 'Update Product' : 'Add Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Products Table -->
    <div class="products-table">
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product._id">
            <td>
              <img v-if="product.image" :src="product.image" :alt="product.name" class="product-image" />
            </td>
            <td>{{ product.name }}</td>
            <td>₹{{ product.price }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.stock }}</td>
            <td>
              <button @click="editProduct(product)" class="edit-btn">Edit</button>
              <button @click="deleteProduct(product._id)" class="delete-btn">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'

interface Product {
  _id: string
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
}

interface ProductForm {
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
}

const products = ref<Product[]>([])
const showAddForm = ref(false)
const editingProduct = ref<Product | null>(null)
const loading = ref(false)
const uploading = ref(false)
const uploadError = ref<string | null>(null)

const productForm = ref<ProductForm>({
  name: '',
  price: 0,
  description: '',
  image: '',
  category: '',
  stock: 0
})

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    return;
  }

  uploading.value = true;
  uploadError.value = null;

  try {
    const response = await api.uploadImage(file);
    productForm.value.image = response.filePath;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    uploadError.value = error.response?.data?.message || 'Image upload failed. Please try again.';
    // Clear the file input
    target.value = '';
  } finally {
    uploading.value = false;
  }
};

const fetchProducts = async () => {
  try {
    loading.value = true
    const response = await api.getAdminProducts()
    products.value = response
  } catch (error) {
    console.error('Error fetching products:', error)
    alert('Failed to fetch products')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  productForm.value = {
    name: '',
    price: 0,
    description: '',
    image: '',
    category: '',
    stock: 0
  }
}

const editProduct = (product: Product) => {
  editingProduct.value = product
  productForm.value = { ...product }
}

const cancelForm = () => {
  showAddForm.value = false
  editingProduct.value = null
  resetForm()
}

const handleSubmit = async () => {
  try {
    if (editingProduct.value) {
      // Update product
      await api.updateProduct(editingProduct.value._id, productForm.value)
      await fetchProducts() // Refresh the list
    } else {
      // Add product
      await api.createProduct(productForm.value)
      await fetchProducts() // Refresh the list
    }
    
    cancelForm()
  } catch (error) {
    console.error('Error saving product:', error)
    alert('Failed to save product')
  }
}

const deleteProduct = async (productId: string) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await api.deleteProduct(productId)
      await fetchProducts() // Refresh the list
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.admin-products {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.add-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.add-btn:hover {
  background: #0056b3;
}

.form-overlay {
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

.form-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.cancel-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.products-table {
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

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.edit-btn, .delete-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.edit-btn {
  background: #ffc107;
  color: #212529;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.file-upload-label {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  text-align: center;
  transition: background-color 0.3s;
}

.file-upload-label:hover {
  background: #2980b9;
}

.file-upload-label.disabled {
  background: #a0a0a0;
  cursor: not-allowed;
}

.file-upload-input {
  display: none;
}

.image-preview {
  margin-top: 1rem;
}

.image-preview img {
  max-width: 100px;
  max-height: 100px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.upload-status, .upload-error {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.upload-error {
  color: #e53e3e;
}
</style> 