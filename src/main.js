// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'   // 引入路由

//import './styles/main.css'       // 全局样式

const app = createApp(App)
app.use(router)                  // 启用路由
app.mount('#app')