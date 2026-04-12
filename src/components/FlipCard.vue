<template>
  <div class="flip-card-page">
    <!-- 卡片整体容器 -->
    <div class="flip-card-wrapper">

      <!-- 顶部橙色区域 -->
      <div class="flip-card-top">
        <!-- 头部：标题 + 右上角按钮组 -->
        <div class="top-header">
          <h2 class="page-title">word card</h2>
          <div class="header-actions">

            <!-- ======================
              复习状态对号按钮（核心）
              1. isReviewed = true  → 实心对号（已复习）
              2. isReviewed = false → 空心对号（未复习）
            ====================== -->
            <button 
              class="check-btn" 
              :class="{ filled: isReviewed }" 
              @click="toggleReviewStatus"
            >
              <!-- 实心对号（已复习） -->
              <svg 
                v-if="isReviewed" 
                width="26" height="26" 
                viewBox="0 0 24 24" 
                fill="white" 
                stroke="none"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>

              <!-- 空心对号（未复习） -->
              <svg 
                v-else 
                width="26" height="26" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                stroke-width="2"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>

            <!-- 返回按钮 -->
            <button class="back-btn" @click="$router.back()">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 大号单词展示区 -->
        <div class="word-display-box">
          <h1 class="big-word">{{ word?.english }}</h1>

          <!-- 喇叭 + 麦克风图标（仅展示） -->
          <div class="action-icons">
            <button class="icon-btn">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              </svg>
            </button>
            <button class="icon-btn">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 底部绿色区域：释义 + 例句 -->
      <div class="flip-card-bottom">
        <div class="meanings-section">
          <h3 class="section-title">meanings</h3>
          <p class="section-text">{{ word?.chinese }}</p>
        </div>

        <div class="sentences-section">
          <h3 class="section-title">sentences</h3>
          <p class="section-text">{{ word?.example || 'No example sentences' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps } from 'vue'
import { useWordStore } from '@/store/wordStore'

// 接收父组件传入的单词对象
const props = defineProps({
  word: {
    type: Object,
    required: true
  }
})

// 单词状态管理
const wordStore = useWordStore()

// ==============================
// 复习状态（自动识别来源）
// 1. Reviewing 进来 → false（空心）
// 2. Reviewed 进来 → true（实心）
// ==============================
const isReviewed = ref(props.word?.isReviewed || false)

// 监听单词数据变化，实时同步状态
watch(
  () => props.word,
  () => {
    isReviewed.value = props.word?.isReviewed || false
  },
  { deep: true }
)

// ==============================
// 点击对号：切换复习状态
// 空心 → 实心：标记已复习 → 进入 Reviewed
// 实心 → 空心：取消复习 → 回到 Reviewing
// ==============================
const toggleReviewStatus = async () => {
  try {
    // 调用接口切换复习状态
    await wordStore.toggleWordReviewStatus(props.word.id)
    // 本地视图立即更新
    isReviewed.value = !isReviewed.value
  } catch (err) {
    alert('操作失败，请重试')
  }
}
</script>

<style scoped>
/* 页面全屏背景 + 居中 */
.flip-card-page {
  width: 100vw;
  min-height: 100vh;
  background: #f0a768;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

/* 卡片整体样式 */
.flip-card-wrapper {
  width: 100%;
  max-width: 900px;
  border-radius: 30px;
  overflow: hidden;
  background: #f0a768;
}

/* 顶部橙色区域 */
.flip-card-top {
  padding: 28px 36px;
}

/* 头部标题栏 */
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: #111;
  margin: 0;
}

/* 按钮组容器 */
.header-actions {
  display: flex;
  gap: 12px;
}

/* ======================
  对号按钮样式
====================== */
.check-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* 实心对号激活样式 */
.check-btn.filled {
  background: rgba(0, 220, 130, 0.3);
}

/* 返回按钮 */
.back-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* 单词展示大盒子 */
.word-display-box {
  background: #f3e7a6;
  border-radius: 24px;
  padding: 60px 30px;
  text-align: center;
  position: relative;
}

/* 大号单词 */
.big-word {
  font-size: 70px;
  font-weight: 900;
  color: #333;
  margin: 0;
}

/* 右下角功能图标 */
.action-icons {
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  gap: 16px;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: default;
}

/* 底部绿色区域 */
.flip-card-bottom {
  background: #81c19a;
  padding: 36px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

/* 释义 & 例句区域 */
.meanings-section,
.sentences-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #111;
  margin: 0;
}

.section-text {
  font-size: 16px;
  color: #222;
  line-height: 1.5;
  margin: 0;
}
</style>