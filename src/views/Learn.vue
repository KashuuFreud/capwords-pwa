<template>
  <div class="learn-page">
    <div class="learn-shell">
      <!-- 顶部 -->
      <section class="top-bar">
        <h1 class="page-title">learn</h1>

        <button class="back-btn" type="button" @click="goResult">
          <span>Back</span>
          <span>→</span>
        </button>
      </section>

      <div class="divider"></div>

      <section class="learn-content">
        <!-- 左侧主学习卡 -->
        <div class="study-panel">
          <div class="study-card">
            <div class="wave-line"></div>
            <div class="soft-circle"></div>
            <div class="corner-shape"></div>

            <div class="card-inner">
              <div class="card-top">
                <span class="card-tag">learning card</span>
                <span class="status-chip">
                  {{ currentWord.word ? `${currentIndex + 1}/${words.length}` : 'empty' }}
                </span>
              </div>

              <div class="card-center">
                <p class="small-label">today’s word</p>

                <h2 class="word-title">
                  {{ currentWord.word || 'word' }}
                </h2>

                <p class="phonetic">
                  {{ currentWord.phonetic || '/.../' }}
                </p>

                <p class="meaning">
                  {{ showMeaning ? (currentWord.meaning || '中文释义') : 'Tap to reveal meaning' }}
                </p>

                <div class="flip-hint">
                  {{ showMeaning ? 'Meaning revealed' : 'Click the button below to show meaning' }}
                </div>
              </div>

              <div class="card-actions">
                <button class="icon-btn" type="button" @click="speakWord" title="Play pronunciation">
                  🔊
                </button>
                <button class="icon-btn" type="button" @click="toggleMeaning" title="Show meaning">
                  {{ showMeaning ? '🙈' : '👀' }}
                </button>
              </div>
            </div>
          </div>

          <div class="primary-actions">
            <button class="secondary-btn" type="button" @click="prevWord">
              Previous
            </button>

            <button class="primary-btn" type="button" @click="nextWord">
              Next word
            </button>
          </div>
        </div>

        <!-- 右侧信息区 -->
        <div class="detail-panel">
          <div class="info-card highlight-card">
            <div class="info-top">
              <h3>definition</h3>
              <span class="mini-badge">AI note</span>
            </div>
            <p>
              {{ currentWord.definition || 'Detailed definition will appear here.' }}
            </p>
          </div>

          <div class="info-card sentence-card">
            <div class="info-top">
              <h3>example sentence</h3>
              <span class="mini-badge alt">usage</span>
            </div>
            <p>
              {{ currentWord.sentence || 'Example sentence will appear here.' }}
            </p>
          </div>

          <div class="progress-card">
            <div class="progress-header">
              <h3>progress</h3>
              <span>{{ progressText }}</span>
            </div>

            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>

            <div class="progress-meta">
              <div class="meta-item">
                <span class="meta-label">current</span>
                <span class="meta-value">{{ currentIndex + 1 }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">total</span>
                <span class="meta-value">{{ words.length }}</span>
              </div>
            </div>
          </div>

          <div class="bottom-actions">
            <button class="ghost-btn" type="button" @click="markReviewed">
              Mark reviewed
            </button>

            <button class="dark-btn" type="button" @click="goReview">
              Go review
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentIndex = ref(0)
const showMeaning = ref(false)

const words = ref([])

const currentWord = computed(() => {
  if (!words.value.length) {
    return {
      word: '',
      phonetic: '',
      meaning: '',
      definition: '',
      sentence: ''
    }
  }
  return words.value[currentIndex.value]
})

const progressPercent = computed(() => {
  if (!words.value.length) return 0
  return ((currentIndex.value + 1) / words.value.length) * 100
})

const progressText = computed(() => {
  if (!words.value.length) return '0%'
  return `${Math.round(progressPercent.value)}%`
})

onMounted(() => {
  const savedReviewWords = JSON.parse(localStorage.getItem('reviewWords') || '[]')
  const savedResult = localStorage.getItem('wordResult')

  if (savedReviewWords.length) {
    words.value = savedReviewWords
  } else if (savedResult) {
    try {
      const parsed = JSON.parse(savedResult)
      words.value = [
        {
          word: parsed.word || '',
          phonetic: parsed.phonetic || '',
          meaning: parsed.meaning || '',
          definition: parsed.definition || '',
          sentence: parsed.sentence || '',
          checked: false
        }
      ]
    } catch (error) {
      console.error('Failed to parse wordResult:', error)
    }
  } else {
    words.value = [
      {
        word: 'apple',
        phonetic: '/ˈæp.əl/',
        meaning: '苹果',
        definition: 'A round fruit with red, green, or yellow skin.',
        sentence: 'I eat an apple after lunch every day.',
        checked: false
      }
    ]
  }
})

const goResult = () => {
  router.push('/result')
}

const goReview = () => {
  router.push('/review')
}

const toggleMeaning = () => {
  showMeaning.value = !showMeaning.value
}

const speakWord = () => {
  if (!currentWord.value.word) {
    alert('No word available.')
    return
  }

  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(currentWord.value.word)
    utterance.lang = 'en-US'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  } else {
    alert('Your browser does not support speech synthesis.')
  }
}

const prevWord = () => {
  if (!words.value.length) return

  if (currentIndex.value === 0) {
    currentIndex.value = words.value.length - 1
  } else {
    currentIndex.value -= 1
  }

  showMeaning.value = false
}

const nextWord = () => {
  if (!words.value.length) return

  if (currentIndex.value === words.value.length - 1) {
    currentIndex.value = 0
  } else {
    currentIndex.value += 1
  }

  showMeaning.value = false
}

const markReviewed = () => {
  if (!words.value.length) return

  const savedWords = JSON.parse(localStorage.getItem('reviewWords') || '[]')

  const updatedWords = savedWords.map((item, index) => {
    if (index === currentIndex.value || item.word === currentWord.value.word) {
      return {
        ...item,
        checked: true
      }
    }
    return item
  })

  localStorage.setItem('reviewWords', JSON.stringify(updatedWords))
  words.value = updatedWords

  alert(`"${currentWord.value.word}" has been marked as reviewed.`)
}
</script>

<style scoped>
.learn-page {
  min-height: 100vh;
  background: #d8e1cf;
  padding: 24px;
  box-sizing: border-box;
}

.learn-shell {
  min-height: calc(100vh - 48px);
  background: #93c47d;
  border-radius: 42px;
  padding: 32px 36px 40px;
  box-sizing: border-box;
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.12);
}

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.page-title {
  margin: 0;
  font-size: 42px;
  font-weight: 800;
  color: #161616;
  text-transform: lowercase;
}

.back-btn {
  border: none;
  background: #f2d3ac;
  color: #1a1a1a;
  border-radius: 999px;
  padding: 14px 22px;
  font-size: 18px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.back-btn:hover,
.primary-btn:hover,
.secondary-btn:hover,
.icon-btn:hover,
.ghost-btn:hover,
.dark-btn:hover {
  transform: translateY(-2px);
}

.divider {
  height: 2px;
  background: rgba(0, 0, 0, 0.12);
  margin: 22px 0 28px;
}

.learn-content {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 28px;
  align-items: start;
}

.study-panel {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.study-card {
  position: relative;
  min-height: 520px;
  border-radius: 36px;
  overflow: hidden;
  background: linear-gradient(135deg, #f1b18c 0%, #ddd086 100%);
  box-shadow: inset 0 0 50px rgba(255, 255, 255, 0.12);
}

.wave-line {
  position: absolute;
  top: 78px;
  left: 34px;
  width: 220px;
  height: 20px;
  opacity: 0.75;
  background:
    radial-gradient(circle at 10px 10px, transparent 8px, #f5e5d8 8px, #f5e5d8 11px, transparent 11px) repeat-x;
  background-size: 44px 20px;
}

.soft-circle {
  position: absolute;
  left: 54px;
  bottom: 42px;
  width: 230px;
  height: 230px;
  border: 14px solid rgba(213, 152, 112, 0.2);
  border-radius: 50%;
}

.corner-shape {
  position: absolute;
  right: -18px;
  top: 150px;
  width: 240px;
  height: 240px;
  background: rgba(224, 177, 201, 0.78);
  clip-path: polygon(100% 0, 100% 100%, 10% 80%);
  border-radius: 30px;
}

.card-inner {
  position: relative;
  z-index: 2;
  height: 100%;
  padding: 28px 32px 26px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-tag {
  font-size: 16px;
  font-weight: 800;
  color: #181818;
  text-transform: lowercase;
}

.status-chip {
  background: rgba(255, 255, 255, 0.44);
  color: #3a2e2e;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
}

.card-center {
  text-align: center;
  padding: 16px 10px;
}

.small-label {
  margin: 0 0 18px;
  font-size: 18px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.62);
  text-transform: lowercase;
}

.word-title {
  margin: 0;
  font-size: 72px;
  line-height: 1;
  font-weight: 800;
  color: #4a0022;
  word-break: break-word;
}

.phonetic {
  margin: 16px 0 20px;
  font-size: 28px;
  color: #3f2435;
  font-weight: 600;
}

.meaning {
  margin: 0;
  font-size: 42px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.2;
  word-break: break-word;
}

.flip-hint {
  margin-top: 24px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.58);
  font-weight: 600;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.icon-btn {
  width: 54px;
  height: 54px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.38);
  font-size: 24px;
  cursor: pointer;
}

.primary-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.secondary-btn,
.primary-btn {
  flex: 1;
  border: none;
  border-radius: 999px;
  padding: 16px 24px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}

.secondary-btn {
  background: #f2d3ac;
  color: #201818;
}

.primary-btn {
  background: #111;
  color: #fff;
}

.detail-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.info-card,
.progress-card {
  border-radius: 28px;
  padding: 24px;
  box-sizing: border-box;
}

.highlight-card {
  background: #f2d3ac;
}

.sentence-card {
  background: #80c5a3;
}

.info-top,
.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.info-card h3,
.progress-card h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #111;
  text-transform: lowercase;
}

.info-card p {
  margin: 0;
  font-size: 19px;
  line-height: 1.7;
  color: rgba(0, 0, 0, 0.72);
}

.mini-badge {
  background: rgba(0, 0, 0, 0.08);
  color: #232323;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
}

.mini-badge.alt {
  background: rgba(255, 255, 255, 0.42);
}

.progress-card {
  background: rgba(255, 255, 255, 0.22);
}

.progress-header span {
  font-size: 16px;
  font-weight: 700;
  color: #1f1f1f;
}

.progress-bar {
  width: 100%;
  height: 14px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 999px;
  background: #111;
  transition: width 0.25s ease;
}

.progress-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 16px;
}

.meta-item {
  background: rgba(255, 255, 255, 0.26);
  border-radius: 18px;
  padding: 14px 16px;
}

.meta-label {
  display: block;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.58);
  margin-bottom: 6px;
  text-transform: lowercase;
}

.meta-value {
  font-size: 24px;
  font-weight: 800;
  color: #111;
}

.bottom-actions {
  display: flex;
  gap: 16px;
}

.ghost-btn,
.dark-btn {
  flex: 1;
  border: none;
  border-radius: 999px;
  padding: 16px 20px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}

.ghost-btn {
  background: #f6efcf;
  color: #191919;
}

.dark-btn {
  background: #111;
  color: #fff;
}

@media (max-width: 1100px) {
  .learn-content {
    grid-template-columns: 1fr;
  }

  .study-card {
    min-height: 460px;
  }
}

@media (max-width: 768px) {
  .learn-page {
    padding: 14px;
  }

  .learn-shell {
    min-height: auto;
    border-radius: 28px;
    padding: 22px 18px 24px;
  }

  .page-title {
    font-size: 30px;
  }

  .back-btn {
    padding: 12px 16px;
    font-size: 15px;
  }

  .study-card {
    min-height: 390px;
    border-radius: 26px;
  }

  .word-title {
    font-size: 50px;
  }

  .phonetic {
    font-size: 22px;
  }

  .meaning {
    font-size: 30px;
  }

  .primary-actions,
  .bottom-actions {
    flex-direction: column;
  }

  .info-card h3,
  .progress-card h3 {
    font-size: 20px;
  }

  .info-card p {
    font-size: 17px;
  }
}
</style>