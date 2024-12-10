<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <router-link to="/">我的博客</router-link>
      </div>
      <nav class="nav-menu">
        <router-link to="/" class="nav-item">首页</router-link>
        <router-link to="/about" class="nav-item">关于</router-link>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'BlogHeader'
}
</script>

<script setup>
// 组件逻辑
</script>

<style scoped>
.header {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 1rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.nav-menu {
  display: flex;
  gap: 20px;
}

.nav-item {
  color: #666;
  text-decoration: none;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: #1e88e5;
  background-color: #f5f5f5;
}
</style> 