<template>
  <div class="word-card-page">
    <!-- 单词卡片整体容器 -->
    <div class="word-card-wrapper">

      <!-- 顶部橙色区域：标题 + 按钮 + 单词展示 -->
      <div class="word-card-top">
        <!-- 头部：标题 + 右上角按钮组 -->
        <div class="top-header">
          <h2 class="page-title">word card</h2>
          <div class="header-actions">

            <!-- ======================
              星星收藏按钮（核心功能）
              1. 已收藏 → 实心金色
              2. 未收藏 → 空心白色
            ====================== -->
            <button 
              class="star-btn" 
              :class="{ filled: isCollected }" 
              @click="toggleCollect"
            >
              <!-- 实心星星（已收藏） -->
              <svg 
                v-if="isCollected" 
                width="26" height="26" 
                viewBox="0 0 24 24" 
                fill="#FFD700" 
                stroke="none"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>

              <!-- 空心星星（未收藏） -->
              <svg 
                v-else 
                width="26" height="26" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                stroke-width="2"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
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

          <!-- 右侧：喇叭 + 麦克风图标（仅展示，无功能） -->
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
      <div class="word-card-bottom">
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

// 接收传入的单词数据
const props = defineProps({
  word: {
    type: Object,
    required: true
  }
})

const wordStore = useWordStore()

// ==============================
// 核心：收藏状态（自动识别来源）
// 1. 拍照识别进来 → isCollected = false（空心）
// 2. 从All列表进来 → isCollected = true（实心）
// ==============================
const isCollected = ref(props.word?.isCollected || false)

// 监听单词变化，自动更新星星状态
watch(
  () => props.word,
  () => {
    isCollected.value = props.word?.isCollected || false
  },
  { deep: true }
)

// ==============================
// 点击星星：切换收藏/取消收藏
// 1. 空心 → 实心 = 加入单词本(All)
// 2. 实心 → 空心 = 从单词本(All)移除
// ==============================
const toggleCollect = async () => {
  try {
    // 调用仓库：切换收藏状态
    await wordStore.toggleWordCollect(props.word.id)
    // 本地视图立即更新
    isCollected.value = !isCollected.value
  } catch (err) {
    alert('收藏操作失败，请重试')
  }
}
</script>

<style scoped>
/* 页面全屏背景 + 居中 */
.word-card-page {
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
.word-card-wrapper {
  width: 100%;
  max-width: 900px;
  border-radius: 30px;
  overflow: hidden;
  background: #f0a768;
}

/* 顶部橙色区域 */
.word-card-top {
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
}

/* 按钮组 */
.header-actions {
  display: flex;
  gap: 12px;
}

/* 星星按钮 */
.star-btn {
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

/* 实心星星样式 */
.star-btn.filled {
  background: rgba(255, 215, 0, 0.2);
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

/* 单词展示框 */
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
}

/* 喇叭/麦克风图标 */
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
.word-card-bottom {
  background: #81c19a;
  padding: 36px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

/* 释义 & 例句 */
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
}

.section-text {
  font-size: 16px;
  color: #222;
  line-height: 1.5;
}
</style>