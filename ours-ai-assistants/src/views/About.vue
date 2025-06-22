<template>
  <div class="page-content">
    <h1>关于我们</h1>
    <div class="content-section">
      <h2>项目介绍</h2>
      <p>这是一个基于Vue 3和Vue Router 4构建的现代化单页应用框架。</p>
      <p>采用左侧导航、右侧内容的经典布局设计，为用户提供良好的浏览体验。</p>
    </div>
    
    <div class="content-section">
      <h2>设计理念</h2>
      <ul>
        <li>简洁明了的界面设计</li>
        <li>直观的导航体验</li>
        <li>响应式布局适配</li>
        <li>模块化组件架构</li>
      </ul>
    </div>

    <div class="content-section">
      <h2>版本信息</h2>
      <p>版本: 1.0.0</p>
      <p>构建时间: 2025年</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.page-content {
  padding: 20px;
}

.content-section {
  margin: 20px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

h2 {
  color: #495057;
  margin-bottom: 15px;
}

ul {
  padding-left: 20px;
}

li {
  margin: 8px 0;
}
</style>
