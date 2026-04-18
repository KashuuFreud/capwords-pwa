<template>
  <div class="profile-view">
    <ProfileUser v-if="isLoggedIn" />
    <ProfileGuest v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ProfileUser from '../components/ProfileUser.vue'
import ProfileGuest from '../components/ProfileGuest.vue'
import { useUserStore } from '../store/userStore'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
}
</style>
