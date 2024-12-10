import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import BlogPost from '../views/BlogPost.vue'
import AboutPage from '../views/AboutPage.vue'
import TagPage from '../views/TagPage.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/post/:id',
    name: 'BlogPost',
    component: BlogPost,
    props: true
  },
  {
    path: '/tag/:name',
    name: 'TagPage',
    component: TagPage,
    props: true
  },
  {
    path: '/about',
    name: 'AboutPage',
    component: AboutPage
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router 