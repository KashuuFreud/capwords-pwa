// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
import Home from '../views/Home.vue'
import Result from '../views/Result.vue'
import Learn from '../views/Learn.vue'
import Review from '../views/Review.vue'
import Profile from '../views/Profile.vue'
import Guide from '../views/Guide.vue'

// 定义路由规则
const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/result', name: 'Result', component: Result },
  { path: '/learn', name: 'Learn', component: Learn },
  { path: '/review', name: 'Review', component: Review },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/guide', name: 'Guide', component: Guide }
]

// 创建 router 实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router