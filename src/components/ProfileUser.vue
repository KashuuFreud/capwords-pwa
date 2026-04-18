<template>
  <div class="profile-page">
    <div class="profile-card">
      <section class="hero-section">
        <div class="hero-text">
          <h1 class="hero-title">
            {{ profile.name }},
            <br />
            you have snapped
            <span class="hero-highlight">{{ totalWords }}</span>
            words!
          </h1>
        </div>

        <div class="hero-avatar">
          <div class="avatar-circle">
            <div class="avatar-head"></div>
            <div class="avatar-body"></div>
          </div>
        </div>
      </section>

      <div class="divider"></div>

      <section class="info-board">
        <div class="board-actions">
          <button class="icon-btn" @click="toggleEdit" title="Edit">Edit</button>
          <button class="icon-btn" @click="goHome" title="Back">Back</button>
        </div>

        <div class="board-content">
          <div class="info-list">
            <div class="info-item">
              <h3>Nick name</h3>
              <p v-if="!isEditing">{{ profile.nickname }}</p>
              <input v-else v-model="editableProfile.nickname" type="text" />
            </div>

            <div class="info-item">
              <h3>Gender</h3>
              <p v-if="!isEditing">{{ profile.gender }}</p>
              <select v-else v-model="editableProfile.gender">
                <option value="female">female</option>
                <option value="male">male</option>
                <option value="other">other</option>
              </select>
            </div>

            <div class="info-item">
              <h3>Grade</h3>
              <p v-if="!isEditing">{{ profile.grade }}</p>
              <select v-else v-model="editableProfile.grade">
                <option value="grade one">grade one</option>
                <option value="grade two">grade two</option>
                <option value="grade three">grade three</option>
                <option value="grade four">grade four</option>
                <option value="grade five">grade five</option>
                <option value="grade six">grade six</option>
              </select>
            </div>

            <div class="info-item">
              <h3>Location</h3>
              <p v-if="!isEditing">{{ profile.location }}</p>
              <input v-else v-model="editableProfile.location" type="text" />
            </div>

            <div class="info-item">
              <h3>Account</h3>
              <p>{{ profile.account }}</p>
            </div>

            <div class="info-item">
              <h3>Bio</h3>
              <p v-if="!isEditing">{{ profile.bio }}</p>
              <textarea v-else v-model="editableProfile.bio" rows="3"></textarea>
            </div>
          </div>

          <div class="board-illustration">
            <div class="illust-circle"></div>
            <div class="hat-top"></div>
            <div class="hat-base"></div>
            <div class="hat-tail"></div>
            <div class="paper-roll"></div>
            <div class="confetti confetti-a"></div>
            <div class="confetti confetti-b"></div>
            <div class="confetti confetti-c"></div>
          </div>
        </div>

        <div v-if="isEditing" class="edit-actions">
          <button class="save-btn" @click="saveProfile">Save</button>
          <button class="cancel-btn" @click="cancelEdit">Cancel</button>
        </div>

        <div v-else class="bottom-actions">
          <button class="ghost-btn" @click="goToReview">Review</button>
          <button class="danger-btn" @click="logout">Log out</button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/userStore'
import { useWordStore } from '../store/wordStore'

const router = useRouter()
const userStore = useUserStore()
const wordStore = useWordStore()
const isEditing = ref(false)

const metadata = userStore.userInfo?.user_metadata || {}

const profile = reactive({
  name: metadata.name || userStore.userInfo?.email || 'Learner',
  nickname: metadata.nickname || 'SnapWord User',
  gender: metadata.gender || 'other',
  grade: metadata.grade || 'grade one',
  location: metadata.location || 'Unknown',
  account: userStore.userInfo?.email || '',
  bio: metadata.bio || 'Keep snapping, keep learning.',
  words: 0
})

const editableProfile = reactive({
  nickname: profile.nickname,
  gender: profile.gender,
  grade: profile.grade,
  location: profile.location,
  bio: profile.bio
})

const syncEditable = () => {
  editableProfile.nickname = profile.nickname
  editableProfile.gender = profile.gender
  editableProfile.grade = profile.grade
  editableProfile.location = profile.location
  editableProfile.bio = profile.bio
}

const toggleEdit = () => {
  syncEditable()
  isEditing.value = true
}

const cancelEdit = () => {
  syncEditable()
  isEditing.value = false
}

const saveProfile = () => {
  profile.nickname = editableProfile.nickname
  profile.gender = editableProfile.gender
  profile.grade = editableProfile.grade
  profile.location = editableProfile.location
  profile.bio = editableProfile.bio
  isEditing.value = false
}

const logout = () => {
  userStore.logout().finally(() => {
    router.go(0)
  })
}

const goHome = () => {
  router.push('/')
}

const goToReview = () => {
  router.push('/review')
}

const totalWords = computed(() => wordStore.allWords.length)

onMounted(async () => {
  try {
    await wordStore.fetchWordList()
  } catch (error) {
    console.error('Failed to load profile words:', error)
  }
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #d8e1cf;
  padding: 24px;
  box-sizing: border-box;
}

.profile-card {
  min-height: calc(100vh - 48px);
  background: #79c19d;
  border: 2px solid rgba(0, 0, 0, 0.12);
  border-radius: 42px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.1);
  padding: 34px 38px 42px;
  box-sizing: border-box;
}

.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.hero-title {
  margin: 0;
  font-size: 64px;
  line-height: 1.08;
  font-weight: 800;
  color: #111;
}

.hero-highlight {
  color: #ef7d42;
}

.hero-avatar {
  flex-shrink: 0;
  padding-right: 28px;
}

.avatar-circle {
  position: relative;
  width: 176px;
  height: 176px;
  border-radius: 50%;
  background: #f2b247;
  overflow: hidden;
}

.avatar-head {
  position: absolute;
  width: 78px;
  height: 92px;
  background: #dc8a8d;
  border-radius: 46px 46px 40px 40px;
  top: 34px;
  left: 54px;
}

.avatar-head::before {
  content: '';
  position: absolute;
  width: 88px;
  height: 54px;
  background: #9f485f;
  border-radius: 48px 48px 22px 18px;
  top: -10px;
  left: -6px;
}

.avatar-head::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: #f2d7c7;
  border-radius: 50%;
  right: -8px;
  top: 32px;
}

.avatar-body {
  position: absolute;
  width: 118px;
  height: 66px;
  background: #c8c462;
  border-radius: 50% 50% 0 0;
  bottom: 8px;
  left: 29px;
}

.divider {
  height: 2px;
  background: rgba(255, 248, 220, 0.6);
  margin: 18px 28px 34px;
}

.info-board {
  position: relative;
  background: #ece8b8;
  border: 2px solid #ea9a43;
  border-radius: 40px;
  padding: 42px 44px 34px;
  min-height: 620px;
  overflow: hidden;
}

.board-actions {
  position: absolute;
  top: 28px;
  right: 34px;
  display: flex;
  gap: 18px;
  z-index: 3;
}

.icon-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  color: #191919;
  cursor: pointer;
}

.board-content {
  display: grid;
  grid-template-columns: 1.2fr 0.9fr;
  gap: 16px;
  align-items: end;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 34px;
  z-index: 2;
  position: relative;
}

.info-item h3 {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 800;
  color: #1d1919;
}

.info-item p {
  margin: 0;
  font-size: 18px;
  color: #48403d;
  line-height: 1.45;
  max-width: 560px;
}

.info-item input,
.info-item select,
.info-item textarea {
  width: min(520px, 100%);
  padding: 12px 14px;
  border: 2px solid rgba(108, 90, 66, 0.18);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.55);
  font-size: 16px;
  color: #2f2927;
  box-sizing: border-box;
  outline: none;
}

.info-item textarea {
  resize: vertical;
  min-height: 88px;
}

.board-illustration {
  position: relative;
  min-height: 360px;
}

.illust-circle {
  position: absolute;
  right: 50px;
  bottom: 34px;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, #f3ed9f 0%, #ebe18f 62%, rgba(243, 237, 159, 0.2) 100%);
  border-radius: 50%;
  box-shadow: 0 36px 46px rgba(146, 118, 66, 0.2);
}

.hat-base {
  position: absolute;
  right: 46px;
  bottom: 82px;
  width: 170px;
  height: 48px;
  background: #4c2cc7;
  transform: skew(-26deg);
  border-radius: 8px;
  z-index: 2;
}

.hat-top {
  position: absolute;
  right: 108px;
  bottom: 120px;
  width: 138px;
  height: 88px;
  background: #5b33d8;
  clip-path: polygon(0 55%, 58% 0, 100% 48%, 42% 100%);
  z-index: 2;
}

.hat-tail {
  position: absolute;
  right: 38px;
  bottom: 70px;
  width: 40px;
  height: 78px;
  background: #5b33d8;
  clip-path: polygon(34% 0, 100% 18%, 66% 100%, 0 76%);
  z-index: 1;
}

.paper-roll {
  position: absolute;
  right: 120px;
  bottom: 170px;
  width: 46px;
  height: 120px;
  background: linear-gradient(180deg, #ef8a45 0%, #d96a3c 100%);
  border-radius: 28px 28px 10px 10px;
  transform: rotate(28deg);
}

.paper-roll::before {
  content: '';
  position: absolute;
  right: -4px;
  top: -8px;
  width: 34px;
  height: 34px;
  border: 4px solid #ef8a45;
  border-radius: 50%;
  background: #f3d399;
}

.confetti {
  position: absolute;
  border-radius: 999px;
}

.confetti-a {
  width: 14px;
  height: 74px;
  background: #ef6f58;
  right: 235px;
  bottom: 180px;
  transform: rotate(-26deg);
}

.confetti-b {
  width: 10px;
  height: 58px;
  background: #5c36d8;
  right: 190px;
  bottom: 170px;
  transform: rotate(10deg);
}

.confetti-c {
  width: 12px;
  height: 48px;
  background: #ef6f58;
  right: 20px;
  bottom: 180px;
  transform: rotate(38deg);
}

.edit-actions,
.bottom-actions {
  display: flex;
  gap: 16px;
  margin-top: 30px;
}

.save-btn,
.cancel-btn,
.ghost-btn,
.danger-btn {
  border: none;
  border-radius: 999px;
  padding: 12px 22px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.save-btn {
  background: #ef7d42;
  color: #1f150e;
}

.cancel-btn,
.ghost-btn {
  background: #dcc66b;
  color: #2a2417;
}

.danger-btn {
  background: #cf7e68;
  color: #251919;
}

@media (max-width: 1024px) {
  .hero-title {
    font-size: 48px;
  }

  .board-content {
    grid-template-columns: 1fr;
  }

  .board-illustration {
    min-height: 260px;
  }

  .avatar-circle {
    width: 140px;
    height: 140px;
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 12px;
  }

  .profile-card {
    min-height: calc(100vh - 24px);
    padding: 20px 18px 24px;
    border-radius: 26px;
  }

  .hero-section {
    align-items: center;
    gap: 14px;
  }

  .hero-title {
    font-size: 34px;
    line-height: 1.15;
  }

  .hero-avatar {
    padding-right: 0;
  }

  .avatar-circle {
    width: 96px;
    height: 96px;
  }

  .avatar-head {
    width: 42px;
    height: 52px;
    left: 29px;
    top: 20px;
  }

  .avatar-head::before {
    width: 50px;
    height: 26px;
    left: -4px;
  }

  .avatar-body {
    width: 62px;
    height: 34px;
    left: 17px;
  }

  .divider {
    margin: 18px 6px 20px;
  }

  .info-board {
    padding: 24px 20px 22px;
    border-radius: 26px;
    min-height: auto;
  }

  .board-actions {
    position: static;
    justify-content: flex-end;
    margin-bottom: 12px;
  }

  .board-content {
    grid-template-columns: 1fr;
  }

  .info-item h3 {
    font-size: 18px;
  }

  .info-item p,
  .info-item input,
  .info-item select,
  .info-item textarea {
    font-size: 15px;
  }

  .board-illustration {
    min-height: 180px;
  }

  .illust-circle {
    width: 130px;
    height: 130px;
    right: 16px;
    bottom: 18px;
  }

  .hat-base {
    width: 96px;
    height: 28px;
    right: 14px;
    bottom: 44px;
  }

  .hat-top {
    width: 82px;
    height: 56px;
    right: 50px;
    bottom: 68px;
  }

  .hat-tail {
    width: 24px;
    height: 48px;
    right: 6px;
    bottom: 36px;
  }

  .paper-roll {
    width: 28px;
    height: 72px;
    right: 56px;
    bottom: 102px;
  }

  .paper-roll::before {
    width: 20px;
    height: 20px;
  }

  .confetti-a,
  .confetti-b,
  .confetti-c {
    display: none;
  }

  .edit-actions,
  .bottom-actions {
    flex-wrap: wrap;
  }
}
</style>
