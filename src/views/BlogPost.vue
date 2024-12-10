<template>
  <div class="post-container">
    <article class="post-content" v-if="post">
      <header class="post-header">
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-meta">
          <span class="post-date">
            <i class="fas fa-calendar"></i>
            {{ post.date }}
          </span>
          <span class="post-author">
            <i class="fas fa-user"></i>
            {{ post.author }}
          </span>
          <span class="post-views">
            <i class="fas fa-eye"></i>
            {{ post.views }} 阅读
          </span>
        </div>
        <div class="post-tags">
          <router-link 
            v-for="tag in post.tags" 
            :key="tag" 
            :to="`/tag/${tag}`" 
            class="tag"
          >
            {{ tag }}
          </router-link>
        </div>
      </header>

      <div class="post-body" v-html="post.content"></div>

      <div class="post-footer">
        <div class="post-actions">
          <button class="action-btn like-btn" @click="handleLike">
            <i class="fas fa-heart" :class="{ 'liked': isLiked }"></i>
            {{ likeCount }} 喜欢
          </button>
          <button class="action-btn share-btn" @click="handleShare">
            <i class="fas fa-share"></i>
            分享
          </button>
        </div>
      </div>
    </article>

    <div v-else class="loading">
      加载中...
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogPost'
}
</script>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const post = ref(null)
const isLiked = ref(false)
const likeCount = ref(42)

// 模拟获取文章数据
const fetchPost = async (id) => {
  // 这里应该是从API获取数据
  post.value = {
    title: 'Vue3 组合式 API 详解',
    date: '2024-03-15',
    author: '张三',
    views: 1234,
    tags: ['Vue3', '前端开发'],
    content: `
      <p>Vue3 的组合式 API 是一个革命性的特性，它让我们能够更好地组织和复用组件逻辑。</p>
      <h2>为什么需要组合式 API？</h2>
      <p>在 Vue2 中，我们主要使用选项式 API 来组织代码。虽然这种方式直观且易于理解，但在处理复杂组件时往往会遇到一些问题：</p>
      <ul>
        <li>相关的逻辑代码被分散到不同的选项中</li>
        <li>难以在组件之间复用逻辑代码</li>
        <li>TypeScript 支持有限</li>
      </ul>
      <p>组合式 API 很好地解决了这些问题...</p>
    `
  }
}

const handleLike = () => {
  isLiked.value = !isLiked.value
  likeCount.value += isLiked.value ? 1 : -1
}

const handleShare = () => {
  // 实现分享功能
  alert('分享功能开发中...')
}

onMounted(async () => {
  await fetchPost(route.params.id)
})
</script>

<style scoped>
.post-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.post-header {
  margin-bottom: 2rem;
}

.post-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.post-meta {
  display: flex;
  gap: 2rem;
  color: #666;
  margin-bottom: 1rem;
}

.post-meta span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.tag {
  background: #f0f0f0;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #666;
  text-decoration: none;
  transition: all 0.3s ease;
}

.tag:hover {
  background: #1e88e5;
  color: white;
}

.post-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #2c3e50;
}

.post-body h2 {
  font-size: 1.8rem;
  color: #34495e;
  margin: 2rem 0 1rem;
}

.post-body p {
  margin-bottom: 1rem;
}

.post-body ul {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.post-body li {
  margin-bottom: 0.5rem;
}

.post-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.post-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.action-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.like-btn {
  background: #ff4757;
  color: white;
}

.like-btn:hover {
  background: #ff6b81;
}

.share-btn {
  background: #1e90ff;
  color: white;
}

.share-btn:hover {
  background: #70a1ff;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.2rem;
}

.liked {
  animation: heart-beat 0.3s ease;
}

@keyframes heart-beat {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
</style> 