<template>
  <div class="blog-list">
    <article v-for="post in posts" :key="post.id" class="blog-card">
      <router-link :to="`/post/${post.id}`" class="blog-link">
        <h2 class="blog-title">{{ post.title }}</h2>
        <div class="blog-meta">
          <span class="date">{{ post.date }}</span>
          <span class="author">{{ post.author }}</span>
        </div>
        <p class="blog-excerpt">{{ post.excerpt }}</p>
        <div class="blog-tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </router-link>
    </article>
  </div>
</template>

<script>
export default {
  name: 'BlogList'
}
</script>

<script setup>
import { ref } from 'vue'

// 模拟博客数据
const posts = ref([
  {
    id: 1,
    title: 'Vue3 组合式 API 详解',
    date: '2024-03-15',
    author: '张三',
    excerpt: 'Vue3 的组合式 API 提供了更好的代码组织方式和逻辑复用能力...',
    tags: ['Vue3', '前端开发']
  },
  {
    id: 2,
    title: '现代 CSS 技巧分享',
    date: '2024-03-14',
    author: '李四',
    excerpt: '探索现代 CSS 新特性，包括 Grid、Flex 布局等常用技巧...',
    tags: ['CSS', '前端开发']
  }
])
</script>

<style scoped>
.blog-list {
  display: grid;
  gap: 2rem;
}

.blog-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.blog-card:hover {
  transform: translateY(-4px);
}

.blog-link {
  display: block;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
}

.blog-title {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.blog-meta {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
}

.blog-excerpt {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.blog-tags {
  display: flex;
  gap: 0.5rem;
}

.tag {
  background: #f0f0f0;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #666;
}
</style> 