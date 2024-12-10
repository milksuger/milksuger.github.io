<template>
  <div class="app-container">
    <BlogHeader />
    <div class="main-content">
      <router-view></router-view>
    </div>
    <BlogFooter />
  </div>
</template>

<script setup>
import BlogHeader from './components/BlogHeader.vue'
import BlogFooter from './components/BlogFooter.vue'
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}
</style>
