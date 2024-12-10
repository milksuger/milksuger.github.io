<template>
  <div class="home-container">
    <main class="main-content">
      <BlogList />
    </main>
    <BlogSidebar class="sidebar" />
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<script setup>
import BlogList from '../components/BlogList.vue'
import BlogSidebar from '../components/BlogSidebar.vue'
</script>

<style scoped>
.home-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (max-width: 768px) {
  .home-container {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    display: none;
  }
}
</style> 