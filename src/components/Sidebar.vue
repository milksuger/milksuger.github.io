<template>
  <aside class="sidebar">
    <!-- 作者信息卡片 -->
    <div class="sidebar-card author-card">
      <img src="https://placekitten.com/100/100" alt="作者头像" class="author-avatar">
      <h3 class="author-name">博主小明</h3>
      <p class="author-bio">热爱前端开发，分享技术心得</p>
      <div class="author-stats">
        <div class="stat-item">
          <span class="stat-value">238</span>
          <span class="stat-label">文章</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">1.2k</span>
          <span class="stat-label">粉丝</span>
        </div>
      </div>
    </div>

    <!-- 最新文章 -->
    <div class="sidebar-card">
      <h3 class="sidebar-title">最新文章</h3>
      <ul class="recent-posts">
        <li v-for="post in recentPosts" :key="post.id">
          <router-link :to="`/post/${post.id}`" class="recent-post-link">
            <span class="post-title">{{ post.title }}</span>
            <span class="post-date">{{ post.date }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- 标签云 -->
    <div class="sidebar-card">
      <h3 class="sidebar-title">标签云</h3>
      <div class="tag-cloud">
        <router-link
          v-for="tag in tags"
          :key="tag.name"
          :to="`/tag/${tag.name}`"
          class="tag"
          :style="{ fontSize: `${tag.size}px` }"
        >
          {{ tag.name }}
        </router-link>
      </div>
    </div>

    <!-- 热门文章 -->
    <div class="sidebar-card">
      <h3 class="sidebar-title">热门文章</h3>
      <ul class="hot-posts">
        <li v-for="post in hotPosts" :key="post.id" class="hot-post-item">
          <router-link :to="`/post/${post.id}`" class="hot-post-link">
            <div class="hot-post-rank">{{ post.rank }}</div>
            <div class="hot-post-info">
              <span class="hot-post-title">{{ post.title }}</span>
              <span class="hot-post-views">{{ post.views }}阅读</span>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

// 最新文章数据
const recentPosts = ref([
  { id: 1, title: 'Vue3 组合式 API 详解', date: '03-15' },
  { id: 2, title: '现代 CSS 技巧分享', date: '03-14' },
  { id: 3, title: 'TypeScript 入门指南', date: '03-13' },
  { id: 4, title: '前端性能优化实践', date: '03-12' },
  { id: 5, title: 'React vs Vue 对比', date: '03-11' }
])

// 标签云数据
const tags = ref([
  { name: 'Vue3', size: 20 },
  { name: 'React', size: 18 },
  { name: 'JavaScript', size: 24 },
  { name: 'CSS', size: 16 },
  { name: 'TypeScript', size: 22 },
  { name: '前端开发', size: 20 },
  { name: '性能优化', size: 18 },
  { name: 'Node.js', size: 16 },
  { name: 'Webpack', size: 14 },
  { name: 'Vite', size: 18 }
])

// 热门文章数据
const hotPosts = ref([
  { id: 1, title: 'Vue3 新特性完全指南', views: '12.5k', rank: '01' },
  { id: 2, title: '前端工程化实践', views: '10.2k', rank: '02' },
  { id: 3, title: 'CSS Grid 布局详解', views: '9.8k', rank: '03' },
  { id: 4, title: 'JavaScript 性能优化', views: '8.6k', rank: '04' },
  { id: 5, title: '响应式设计最佳实践', views: '7.9k', rank: '05' }
])
</script>

<style scoped>
.sidebar {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.sidebar-title {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

/* 作者卡片样式 */
.author-card {
  text-align: center;
}

.author-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.author-name {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.author-bio {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.author-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
}

/* 最新文章样式 */
.recent-posts {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recent-post-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  text-decoration: none;
  color: #333;
  transition: color 0.3s ease;
}

.recent-post-link:hover {
  color: #1e88e5;
}

.post-date {
  font-size: 0.8rem;
  color: #666;
}

/* 标签云样式 */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  text-decoration: none;
  color: #666;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.tag:hover {
  background: #1e88e5;
  color: white;
}

/* 热门文章样式 */
.hot-posts {
  list-style: none;
  padding: 0;
  margin: 0;
}

.hot-post-item {
  margin-bottom: 0.8rem;
}

.hot-post-link {
  display: flex;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.hot-post-link:hover {
  background-color: #f5f5f5;
}

.hot-post-rank {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ff4757;
  min-width: 30px;
}

.hot-post-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hot-post-title {
  font-size: 0.9rem;
  color: #333;
}

.hot-post-views {
  font-size: 0.8rem;
  color: #666;
}
</style> 