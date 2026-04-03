<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="logo">CapWords</div>
      <div class="nav-links">
        <router-link to="/">首页</router-link>
        <router-link to="/review">复习</router-link>
        <router-link to="/vocab">词汇本</router-link>
        <router-link to="/camera">拍照识词</router-link>
      </div>
      <div class="user-info">
        <template v-if="userStore.token">
          <span class="username">{{ userStore.userInfo?.username }}</span>
          <button @click="handleLogout" class="logout-btn">退出登录</button>
        </template>
        <template v-else>
          <router-link to="/login" class="login-btn">登录</router-link>
          <router-link to="/register" class="register-btn">注册</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar { background: #409eff; color: #fff; padding: 0 20px; }
.nav-container { max-width: 1200px; margin: 0 auto; height: 60px; display: flex; align-items: center; justify-content: space-between; }
.logo { font-size: 20px; font-weight: bold; }
.nav-links { display: flex; gap: 30px; }
.nav-links a { color: #fff; text-decoration: none; font-size: 16px; }
.user-info { display: flex; align-items: center; gap: 15px; }
.username { font-size: 16px; }
.logout-btn, .login-btn, .register-btn {
  padding: 6px 16px; border: none; border-radius: 4px; cursor: pointer; text-decoration: none;
}
.logout-btn { background: #fff; color: #409eff; }
.login-btn { background: transparent; border: 1px solid #fff; color: #fff; }
.register-btn { background: #fff; color: #409eff; }
</style>