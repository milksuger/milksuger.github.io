<template>
  <div class="page-content">
    <h1>我们的服务</h1>
    
    <div class="services-grid">
      <div class="service-card">
        <h3>Web开发</h3>
        <p>提供现代化的Web应用开发服务，使用最新的前端技术栈。</p>
        <ul>
          <li>Vue.js应用开发</li>
          <li>响应式设计</li>
          <li>性能优化</li>
        </ul>
      </div>

      <div class="service-card">
        <h3>UI/UX设计</h3>
        <p>专业的用户界面和用户体验设计，提升产品的可用性。</p>
        <ul>
          <li>界面设计</li>
          <li>交互设计</li>
          <li>用户体验优化</li>
        </ul>
      </div>

      <div class="service-card">
        <h3>技术咨询</h3>
        <p>为您的项目提供专业的技术咨询和解决方案。</p>
        <ul>
          <li>技术选型</li>
          <li>架构设计</li>
          <li>代码审查</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Services'
}
</script>

<style scoped>
.page-content {
  padding: 20px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.service-card {
  background-color: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

h3 {
  color: #495057;
  margin-bottom: 15px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
}

ul {
  padding-left: 20px;
  margin-top: 10px;
}

li {
  margin: 5px 0;
}
</style>
