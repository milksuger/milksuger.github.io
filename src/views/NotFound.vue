<template>
  <div class="not-found">
    <h1>404</h1>
    <p>抱歉，页面不存在</p>
    <router-link to="/" class="home-link">返回首页</router-link>
  </div>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 4rem 1rem;
}

h1 {
  font-size: 6rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

p {
  font-size: 1.5rem;
  color: #666;
  margin-bottom: 2rem;
}

.home-link {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #1e88e5;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.home-link:hover {
  background-color: #1976d2;
}
</style> 