<template>
  <div class="admin-layout">
    <nav class="admin-nav">
      <div class="nav-header">
        <h2>Admin Panel</h2>
      </div>
      <div class="nav-back-link mb-4">
        <router-link to="/" class="back-link">← Back to Store</router-link>
      </div>
      <ul class="nav-menu">
        <li>
          <router-link to="/admin/dashboard" class="nav-link">
            Dashboard
          </router-link>
        </li>
        <li>
          <router-link to="/admin/products" class="nav-link">
            Products
          </router-link>
        </li>
        <li>
          <router-link to="/admin/orders" class="nav-link">
            Orders
          </router-link>
        </li>
      </ul>
      <div class="nav-footer">
        <!-- Removed Back to Store from here -->
      </div>
    </nav>
    
    <main class="admin-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for now
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}

.admin-nav {
  width: 250px;
  background: #343a40;
  color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.nav-header {
  padding: 1rem 0;
  border-bottom: 1px solid #495057;
  margin-bottom: 1rem;
}

.nav-header h2 {
  margin: 0;
  color: white;
  font-size: 1.25rem;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.nav-menu li {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: block;
  padding: 0.75rem 1rem;
  color: #adb5bd;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: #495057;
  color: white;
}

.nav-footer {
  padding: 1rem 0;
  border-top: 1px solid #495057;
  margin-top: auto;
}

.back-link {
  color: #adb5bd;
  text-decoration: none;
  font-size: 0.9rem;
}

.back-link:hover {
  color: white;
}

.admin-content {
  flex: 1;
  padding: 0;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  
  .admin-nav {
    width: 100%;
    padding: 0.5rem;
  }
  
  .nav-menu {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
  }
  
  .nav-menu li {
    margin-bottom: 0;
  }
  
  .nav-link {
    white-space: nowrap;
  }
}
</style> 