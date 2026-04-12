// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'   // 引入路由
import { createPinia } from 'pinia'   // 状态管理库

//import './styles/main.css'       // 全局样式

const app = createApp(App)
app.use(router) 
app.use(createPinia())                 // 启用路由
app.mount('#app')