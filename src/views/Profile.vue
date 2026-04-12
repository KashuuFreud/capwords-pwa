<template>
  <div class="profile-loading-page">
    <div class="loading-card">
      <p class="loading-text">Loading profile...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const token = localStorage.getItem('capwords_token')

  if (token) {
    router.replace('/profile/user')
  } else {
    router.replace('/profile/guest')
  }
})
</script>

<style scoped>
.profile-loading-page {
  min-height: 100vh;
  background: #d8e1cf;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}

.loading-card {
  background: #77c39e;
  border-radius: 32px;
  padding: 32px 40px;
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.08);
}

.loading-text {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1d2a21;
}
</style>