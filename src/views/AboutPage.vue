<template>
  <div class="about-page">
    <h1>关于我的博客</h1>
    <section class="about-section">
      <h2>博客简介</h2>
      <p>这是一个专注于前端开发技术分享的个人博客，主要涉及 Vue.js、React、JavaScript 等相关技术。</p>
    </section>
    
    <section class="about-section">
      <h2>关于我</h2>
      <p>我是一名前端开发工程师，热爱技术，喜欢分享。通过这个博客，我希望能够记录自己的学习历程，同时也能帮助到其他开发者。</p>
    </section>
    
    <section class="about-section">
      <h2>联系方式</h2>
      <ul class="contact-list">
        <li>
          <i class="fas fa-envelope"></i>
          <span>Email: example@email.com</span>
        </li>
        <li>
          <i class="fab fa-github"></i>
          <span>GitHub: github.com/example</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AboutPage'
}
</script>

<style scoped>
.about-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.about-section {
  margin-bottom: 3rem;
}

h2 {
  font-size: 1.8rem;
  color: #34495e;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #666;
}

.contact-list {
  list-style: none;
  padding: 0;
}

.contact-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #666;
}

.contact-list i {
  color: #1e88e5;
  width: 24px;
}
</style> 