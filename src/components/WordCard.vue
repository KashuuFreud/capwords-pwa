<template>
  <div class="word-card-wrapper">
    <!-- 顶部橙色区域 -->
    <div class="word-card-top">
      <div class="top-header">
        <h2 class="page-title">word card</h2>
        <!-- 操作按钮组：对号 + 返回 -->
        <div class="header-actions">
          <button 
            class="check-btn" 
            @click="toggleReviewed"
            :class="{ checked: isReviewed }"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </button>

          <button class="back-btn" @click="$router.back()">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="word-display-box">
        <!-- UI装饰元素 -->
        <div class="decor-line"></div>
        <div class="decor-shape"></div>
        <div class="decor-triangle"></div>
        
        <h1 class="big-word">{{ word.english }}</h1>
        
        <!-- 右下角喇叭+麦克风图标（按UI补全） -->
        <div class="action-icons">
          <button class="icon-btn" @click="playAudio">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
          </button>
          <button class="icon-btn" @click="startRecord">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" y1="19" x2="12" y2="23"/>
              <line x1="8" y1="23" x2="16" y2="23"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 底部绿色区域 -->
    <div class="word-card-bottom">
      <div class="meanings-section">
        <h3 class="section-title">meanings</h3>
        <p class="section-text">{{ word.chinese }}</p>
        <button class="small-btn">GitHub Docs →</button>
      </div>

      <div class="sentences-section">
        <h3 class="section-title">sentences</h3>
        <p class="section-text">{{ word.example || '暂无例句' }}</p>
        <button class="small-btn">Visit m3.io →</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useWordStore } from '@/store/wordStore'

const router = useRouter()
const props = defineProps({
  word: { type: Object, required: true }
})
const wordStore = useWordStore()

// 同步复习状态
const isReviewed = ref(props.word.isReviewed ?? false)
watch(() => props.word.isReviewed, (newVal) => {
  isReviewed.value = newVal ?? false
}, { immediate: true })

// 切换复习状态
const toggleReviewed = async () => {
  isReviewed.value = !isReviewed.value
  await wordStore.updateWordReviewStatus(props.word.id, isReviewed.value)
  // 触发列表刷新，让筛选实时生效
  window.dispatchEvent(new CustomEvent('wordReviewStatusChanged'))
}

// 喇叭：播放发音（预留接口）
const playAudio = () => {
  console.log('播放单词发音：', props.word.english)
  // 后续对接发音接口
}

// 麦克风：跟读录音（预留接口）
const startRecord = () => {
  console.log('开始跟读录音：', props.word.english)
  // 后续对接录音接口
}
</script>

<style scoped>
.word-card-wrapper {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  border-radius: 30px;
  overflow: hidden;
  background: #f0a768; /* UI主橙色 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.word-card-top {
  padding: 28px 36px;
  position: relative;
}

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

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.check-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: #f9dfc6;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.check-btn.checked {
  background: #63b07f; /* 已复习主题绿 */
  color: #fff;
}

.back-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: #f9dfc6;
  color: #111;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.back-btn:hover {
  background: #f2c9a6;
}

.word-display-box {
  position: relative;
  background: #f3e7a6; /* UI浅黄色 */
  border-radius: 24px;
  padding: 60px 30px;
  text-align: center;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* 装饰波浪线（匹配UI） */
.decor-line {
  position: absolute;
  top: 16px;
  left: 0;
  width: 50%;
  height: 16px;
  background: repeating-linear-gradient(
    90deg,
    #e6a850,
    #e6a850 12px,
    transparent 12px,
    transparent 24px
  );
  border-radius: 8px;
  opacity: 0.8;
}

/* 装饰云朵形状 */
.decor-shape {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40%;
  height: 100px;
  background: linear-gradient(135deg, #f7b7a3 0%, #f2c9a6 100%);
  border-radius: 60px 60px 0 0;
  opacity: 0.7;
}

/* 装饰粉色三角 */
.decor-triangle {
  position: absolute;
  top: 20%;
  right: 0;
  width: 25%;
  height: 60%;
  background: #f2c4c4;
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
  opacity: 0.8;
}

.big-word {
  position: relative;
  z-index: 2;
  font-size: 70px;
  font-weight: 900;
  color: #333;
  margin: 0;
}

/* 右下角图标组（按UI补全） */
.action-icons {
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  gap: 16px;
  z-index: 2;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #111;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.icon-btn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.word-card-bottom {
  background: #81c19a; /* UI主绿色 */
  padding: 36px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.meanings-section,
.sentences-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  margin: 0 0 12px 0;
}

.small-btn {
  align-self: flex-start;
  background: #f9dfc6;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.small-btn:hover {
  transform: translateY(-2px);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .word-card-wrapper { border-radius: 24px; }
  .word-card-top { padding: 20px; }
  .page-title { font-size: 24px; }
  .big-word { font-size: 48px; }
  .word-card-bottom { grid-template-columns: 1fr; padding: 24px; gap: 24px; }
  .check-btn, .back-btn { width: 36px; height: 36px; }
}
</style>