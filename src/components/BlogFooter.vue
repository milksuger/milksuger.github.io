<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>关于博客</h3>
        <p>分享前端开发技术和经验</p>
      </div>
      <div class="footer-section">
        <h3>联系方式</h3>
        <p>Email: example@email.com</p>
        <p>GitHub: github.com/example</p>
      </div>
      <div class="footer-section">
        <h3>友情链接</h3>
        <ul>
          <li><a href="#">Vue.js 官网</a></li>
          <li><a href="#">React 官网</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 我的博客. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'BlogFooter'
}
</script>

<style scoped>
.footer {
  background-color: #2c3e50;
  color: #fff;
  padding: 3rem 0 1rem;
  margin-top: 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.footer-section h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #fff;
}

.footer-section p {
  color: #bdc3c7;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: #fff;
}

.footer-bottom {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #34495e;
}

.footer-bottom p {
  color: #bdc3c7;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style> 