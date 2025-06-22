<template>
  <div class="page-content">
    <h1>欢迎来到首页</h1>
    <p>这是一个使用Vue Router 4.x构建的单页应用示例。</p>
    <div class="content-section">
      <h2>主要功能</h2>
      <ul>
        <li>左侧导航栏</li>
        <li>右侧内容区域</li>
        <li>路由切换</li>
        <li>响应式布局</li>
      </ul>
    </div>
    <div class="content-section">
      <h2>技术栈</h2>
      <p>Vue 3 + Vue Router 4 + Vite</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.page-content {
  padding: 20px;
}

.content-section {
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

h2 {
  color: #34495e;
  margin-bottom: 15px;
}

ul {
  padding-left: 20px;
}

li {
  margin: 5px 0;
}
</style>
