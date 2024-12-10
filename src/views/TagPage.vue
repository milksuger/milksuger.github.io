<template>
  <div class="tag-page">
    <h1 class="tag-title">标签：{{ name }}</h1>
    <div class="posts-container">
      <article v-for="post in tagPosts" :key="post.id" class="blog-card">
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
  </div>
</template>

<script>
export default {
  name: 'TagPage'
}
</script>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const name = ref(route.params.name)
const tagPosts = ref([])

// 模拟获取标签相关的文章
const fetchTagPosts = async (tagName) => {
  // 这里应该是从API获取数据
  tagPosts.value = [
    {
      id: 1,
      title: 'Vue3 组合式 API 详解',
      date: '2024-03-15',
      author: '张三',
      excerpt: 'Vue3 的组合式 API 提供了更好的代码组织方式和逻辑复用能力...',
      tags: ['Vue3', '前端开发']
    }
  ]
}

onMounted(() => {
  fetchTagPosts(name.value)
})

watch(() => route.params.name, (newName) => {
  name.value = newName
  fetchTagPosts(newName)
})
</script>

<style scoped>
.tag-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.tag-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.posts-container {
  display: grid;
  gap: 2rem;
}

/* 复用 BlogList 的样式 */
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