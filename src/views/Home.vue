<template>
  <div class="home-page">
    <div class="home-card">
      <!-- 顶部区域 -->
      <section class="hero-section">
        <div class="hero-left">
          <h1 class="hero-title">
            where there is a will，there’s a way
          </h1>
        </div>

        <div class="hero-right">
          <div class="profile-wrapper" @click="goToProfile">
            <img
              :src="profileIcon"
              alt="profile"
              class="profile-icon"
            />
            <button class="profile-entry" type="button">
              <span class="profile-text">Profile</span>
              <span class="profile-arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      <div class="divider"></div>

      <div class="date-text">date</div>

      <!-- 下方内容区 -->
      <section class="content-section">
        <!-- 左侧相机区域 -->
        <div class="camera-area">
          <div class="camera-card" @click="toggleCameraMenu">
            <img
              :src="cameraIcon"
              alt="camera"
              class="camera-image"
            />
          </div>

          <transition name="fade-slide">
            <div v-if="showCameraMenu" class="camera-menu">
              <button
                class="menu-btn take-photo-btn"
                type="button"
                @click="goToCameraPage"
              >
                take a pic
              </button>

              <label for="photo-input" class="menu-btn choose-file-btn">
                photo library
              </label>
            </div>
          </transition>
        </div>

        <!-- 右侧 history 卡片 -->
        <div class="history-card" @click="goToReview">
          <h2 class="history-title">history</h2>

          <div class="history-list">
            <div
              v-for="item in historyWords"
              :key="item.word"
              class="history-item"
            >
              <div class="history-info">
                <div class="word">{{ item.word }}</div>
                <div class="meaning">{{ item.meaning }}</div>
              </div>

              <input
                type="checkbox"
                :checked="item.checked"
                class="history-checkbox"
                disabled
              />
            </div>
          </div>
        </div>
      </section>

      <!-- 真隐藏 input -->
      <input
        id="photo-input"
        ref="fileInput"
        type="file"
        accept="image/*"
        class="visually-hidden-input"
        @change="handleFileChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import cameraIcon from '../assets/icons/camera.png'
import profileIcon from '../assets/icons/profile.png'

const router = useRouter()
const showCameraMenu = ref(false)

const historyWords = ref([
  { word: 'apple', meaning: 'n.苹果', checked: true },
  { word: 'boy', meaning: 'n.男孩', checked: false },
  { word: 'phone', meaning: 'n.手机', checked: true },
  { word: 'cup', meaning: 'n.杯子', checked: true }
])

const goToProfile = () => {
  router.push('/profile')
}

const goToReview = () => {
  router.push('/review')
}

const toggleCameraMenu = () => {
  showCameraMenu.value = !showCameraMenu.value
}

const goToCameraPage = () => {
  showCameraMenu.value = false
  router.push('/camera')
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return

  console.log('selected:', file.name)
  showCameraMenu.value = false
  router.push('/result')
  event.target.value = ''
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #d8e1cf;
  padding: 24px;
  box-sizing: border-box;
}

.home-card {
  min-height: calc(100vh - 48px);
  background: #63b07f;
  border: 2px solid rgba(0, 0, 0, 0.12);
  border-radius: 42px;
  box-shadow: 0 26px 50px rgba(0, 0, 0, 0.12);
  padding: 34px 38px 42px;
  box-sizing: border-box;
}

.hero-section {
  position: relative;
  background: #cedb9a;
  border-radius: 30px;
  padding: 42px 46px 54px;
}

.hero-left {
  flex: 1;
}

.hero-title {
  margin: 0;
  max-width: 820px;
  font-size: 64px;
  line-height: 1.05;
  font-weight: 800;
  color: #111;
  word-break: break-word;
}

.hero-right {
  position: absolute;
  top: 34px;
  right: 70px;
}

.profile-wrapper {
  position: relative;
  width: 285px;
  height: 140px;
  cursor: pointer;
}

.profile-entry {
  position: absolute;
  right: 0;
  bottom: 12px;
  border: none;
  background: #c7cf9e;
  border-radius: 999px;
  padding: 20px 30px 20px 92px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}

.profile-icon {
  position: absolute;
  left: 0;
  top: 0;
  width: 150px;
  height: 150px;
  object-fit: contain;
  display: block;
  z-index: 2;
}

.profile-text {
  font-size: 30px;
  font-weight: 700;
  color: #111;
}

.profile-arrow {
  font-size: 28px;
  font-weight: 700;
  color: #111;
}

.divider {
  height: 2px;
  background: rgba(90, 80, 80, 0.25);
  margin: 28px 70px 32px;
}

.date-text {
  font-size: 26px;
  color: #111;
  margin-left: 70px;
  margin-bottom: 22px;
}

.content-section {
  display: grid;
  grid-template-columns: 1.7fr 1fr;
  gap: 36px;
  align-items: stretch;
  padding: 0 32px 10px;
}

.camera-area {
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: relative;
}

.camera-card {
  min-height: 430px;
  background: #c56f34;
  border-radius: 26px;
  box-shadow: 0 25px 45px rgba(112, 96, 50, 0.28);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: visible;
}

.camera-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 30px 52px rgba(112, 96, 50, 0.34);
}

.camera-image {
  position: absolute;
  width: 92%;
  max-width: 760px;
  left: 80%;
  top: 42%;
  transform: translate(-50%, -50%);
  object-fit: contain;
  display: block;
  z-index: 2;
  pointer-events: none;
}

.camera-menu {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 6px;
}

.menu-btn {
  min-width: 170px;
  border: none;
  border-radius: 999px;
  padding: 15px 24px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.12);
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.menu-btn:hover {
  transform: translateY(-2px);
  opacity: 0.96;
}

.take-photo-btn {
  background: #63b07f;
  color: #fff;
}

.choose-file-btn {
  background: #cedb9a;
  color: #111;
}

.history-card {
  min-height: 430px;
  background: #d09154;
  border-radius: 26px;
  padding: 28px 26px;
  box-sizing: border-box;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.history-card:hover {
  transform: translateY(-2px);
}

.history-title {
  margin: 0 0 28px;
  font-size: 22px;
  font-weight: 500;
  color: #222;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.history-info .word {
  font-size: 22px;
  font-weight: 700;
  color: #111;
  margin-bottom: 6px;
}

.history-info .meaning {
  font-size: 18px;
  color: #333;
}

.history-checkbox {
  width: 22px;
  height: 22px;
  accent-color: #7b4f5d;
  cursor: default;
}

.visually-hidden-input {
  position: fixed;
  left: -9999px;
  top: -9999px;
  opacity: 0;
  pointer-events: none;
  width: 1px;
  height: 1px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.22s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 平板 */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 48px;
    max-width: 100%;
  }

  .profile-icon {
    width: 72px;
    height: 72px;
  }

  .profile-text {
    font-size: 22px;
  }

  .content-section {
    grid-template-columns: 1fr;
  }

  .camera-card,
  .history-card {
    min-height: 320px;
  }

  .camera-menu {
    justify-content: flex-start;
  }
}

/* 手机 */
@media (max-width: 768px) {
  .home-page {
    padding: 12px;
  }

  .home-card {
    min-height: calc(100vh - 24px);
    padding: 18px;
    border-radius: 26px;
  }

  .hero-section {
    padding: 24px 20px 28px;
    border-radius: 22px;
  }

  .hero-title {
    font-size: 34px;
    line-height: 1.15;
  }

  .hero-right {
    position: static;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 18px;
  }

  .profile-wrapper {
    width: 180px;
    height: 80px;
  }

  .profile-entry {
    padding: 8px 14px 8px 42px;
    bottom: 0;
  }

  .profile-icon {
    width: 56px;
    height: 56px;
  }

  .profile-text,
  .profile-arrow {
    font-size: 18px;
  }

  .divider {
    margin: 20px 8px 18px;
  }

  .date-text {
    margin-left: 8px;
    margin-bottom: 16px;
    font-size: 18px;
  }

  .content-section {
    padding: 0;
    gap: 18px;
  }

  .camera-card,
  .history-card {
    min-height: auto;
    padding: 18px;
  }

  .camera-image {
    width: 96%;
    left: 74%;
    top: 40%;
  }

  .camera-menu {
    gap: 10px;
    justify-content: center;
  }

  .menu-btn {
    width: 100%;
    min-width: 0;
    font-size: 15px;
    padding: 13px 18px;
  }

  .history-info .word {
    font-size: 18px;
  }

  .history-info .meaning {
    font-size: 15px;
  }
}
</style>