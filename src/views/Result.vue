<template>
  <div class="result-page">
    <div class="result-shell">
      <section class="top-bar">
        <h1 class="page-title">result</h1>

        <button class="back-btn" type="button" @click="goHome">
          <span>Back</span>
          <span>-></span>
        </button>
      </section>

      <div class="divider"></div>

      <section class="result-content">
        <div class="preview-panel">
          <div class="preview-header">
            <span class="preview-label">your photo</span>
            <span class="preview-badge">
              {{ hasImage ? 'recognized' : 'no image' }}
            </span>
          </div>

          <div class="image-box">
            <img
              v-if="capturedImage"
              :src="capturedImage"
              alt="captured"
              class="preview-image"
            />
            <div v-else class="empty-image">
              <span>No image selected</span>
            </div>
          </div>

          <button class="retake-btn" type="button" @click="goHome">
            Retake
          </button>
        </div>

        <div class="word-panel">
          <div class="word-card">
            <div class="wave-line"></div>
            <div class="soft-circle"></div>
            <div class="corner-shape"></div>

            <div class="card-inner">
              <div class="word-top">
                <span class="card-tag">word card</span>
                <span class="status-chip">
                  {{ result.word ? 'AI result' : 'waiting' }}
                </span>
              </div>

              <div class="word-main">
                <div class="word-letter">
                  {{ result.word || 'word' }}
                </div>

                <div class="phonetic">
                  {{ result.phonetic || '/.../' }}
                </div>

                <div class="meaning-cn">
                  {{ result.meaning || 'result' }}
                </div>
              </div>

              <div class="audio-actions">
                <button
                  class="icon-btn"
                  type="button"
                  title="Play pronunciation"
                  @click="speakWord"
                >
                  Play
                </button>

                <button
                  class="icon-btn"
                  type="button"
                  title="Record"
                  @click="mockRecord"
                >
                  Rec
                </button>
              </div>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-card">
              <h3>meanings</h3>
              <p>{{ result.definition || result.meaning || 'Describe the word here.' }}</p>
            </div>

            <div class="info-card">
              <h3>sentences</h3>
              <p>{{ result.sentence || 'Example sentence will appear here.' }}</p>
            </div>
          </div>

          <div class="action-row">
            <button class="secondary-btn" type="button" :disabled="saving" @click="saveWord">
              {{ saving ? 'Saving...' : 'Add to review' }}
            </button>

            <button class="primary-btn" type="button" @click="goLearn">
              Learn now
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { addWordToVocab } from '../services'

const router = useRouter()

const capturedImage = ref('')
const saving = ref(false)

const result = reactive({
  imageUrl: '',
  stickerUrl: '',
  word: '',
  wordEn: '',
  wordCn: '',
  phonetic: '',
  meaning: '',
  definition: '',
  sentence: '',
  candidates: []
})

const hasImage = computed(() => !!capturedImage.value)

onMounted(() => {
  const savedImage = localStorage.getItem('capturedImage')
  const savedResult = localStorage.getItem('wordResult')

  if (savedImage) {
    capturedImage.value = savedImage
  }

  if (savedResult) {
    try {
      const parsed = JSON.parse(savedResult)
      result.imageUrl = parsed.imageUrl || ''
      result.stickerUrl = parsed.stickerUrl || ''
      result.word = parsed.word || ''
      result.wordEn = parsed.wordEn || parsed.word || ''
      result.wordCn = parsed.wordCn || parsed.translation || ''
      result.phonetic = parsed.phonetic || ''
      result.meaning = parsed.meaning || parsed.translation || parsed.wordCn || ''
      result.definition = parsed.definition || ''
      result.sentence = parsed.sentence || ''
      result.candidates = parsed.candidates || []
    } catch (error) {
      console.error('Failed to parse wordResult:', error)
    }
  }
})

const goHome = () => {
  router.push('/')
}

const goLearn = () => {
  router.push('/learn')
}

const saveWord = async () => {
  if (!result.word) {
    alert('No word result to save yet.')
    return
  }

  saving.value = true

  try {
    const response = await addWordToVocab({
      imageUrl: result.imageUrl || capturedImage.value,
      stickerUrl: result.stickerUrl,
      word: result.word,
      wordEn: result.wordEn || result.word,
      wordCn: result.wordCn || result.meaning,
      candidates: result.candidates,
      isCollected: true,
      isReviewed: false
    })

    if (response?.word) {
      localStorage.setItem('savedWord', JSON.stringify(response.word))
    }

    alert(`"${result.word}" has been added to your review list.`)
  } catch (error) {
    alert(error.message || 'Failed to save the word.')
  } finally {
    saving.value = false
  }
}

const speakWord = () => {
  if (!result.word) {
    alert('No word available.')
    return
  }

  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(result.word)
    utterance.lang = 'en-US'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  } else {
    alert('Your browser does not support speech synthesis.')
  }
}

const mockRecord = () => {
  alert('Recording feature will be connected later.')
}
</script>

<style scoped>
.result-page {
  min-height: 100vh;
  background: #d8e1cf;
  padding: 24px;
  box-sizing: border-box;
}

.result-shell {
  min-height: calc(100vh - 48px);
  background: #e59666;
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
.retake-btn:hover,
.primary-btn:hover,
.secondary-btn:hover,
.icon-btn:hover {
  transform: translateY(-2px);
}

.divider {
  height: 2px;
  background: rgba(0, 0, 0, 0.12);
  margin: 22px 0 28px;
}

.result-content {
  display: grid;
  grid-template-columns: 0.95fr 1.35fr;
  gap: 28px;
  align-items: start;
}

.preview-panel {
  background: rgba(255, 255, 255, 0.18);
  border-radius: 30px;
  padding: 22px;
  box-sizing: border-box;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.preview-label {
  font-size: 18px;
  font-weight: 700;
  color: #191919;
  text-transform: lowercase;
}

.preview-badge {
  background: #dce9aa;
  color: #222;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
}

.image-box {
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: 24px;
  overflow: hidden;
  background: #f1dcbf;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.empty-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.45);
  font-size: 18px;
  font-weight: 600;
}

.retake-btn {
  margin-top: 18px;
  width: 100%;
  border: none;
  background: #f2d3ac;
  color: #1a1a1a;
  border-radius: 999px;
  padding: 15px 18px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
}

.word-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.word-card {
  position: relative;
  min-height: 420px;
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
  left: 60px;
  bottom: 34px;
  width: 220px;
  height: 220px;
  border: 14px solid rgba(213, 152, 112, 0.2);
  border-radius: 50%;
}

.corner-shape {
  position: absolute;
  right: -20px;
  top: 130px;
  width: 240px;
  height: 240px;
  background: rgba(224, 177, 201, 0.8);
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

.word-top {
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

.word-main {
  text-align: center;
  padding: 20px 10px 10px;
}

.word-letter {
  font-size: 68px;
  font-weight: 800;
  color: #4a0022;
  line-height: 1;
  margin-bottom: 12px;
  word-break: break-word;
}

.phonetic {
  font-size: 28px;
  color: #3f2435;
  font-weight: 600;
  margin-bottom: 18px;
}

.meaning-cn {
  font-size: 56px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.86);
  transform: rotate(-18deg);
  display: inline-block;
  word-break: break-word;
}

.audio-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.icon-btn {
  min-width: 54px;
  height: 54px;
  border: none;
  border-radius: 27px;
  background: rgba(255, 255, 255, 0.38);
  font-size: 16px;
  cursor: pointer;
  padding: 0 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.info-card {
  background: #80c5a3;
  border-radius: 28px;
  padding: 24px 24px 26px;
  min-height: 170px;
  box-sizing: border-box;
}

.info-card h3 {
  margin: 0 0 10px;
  font-size: 24px;
  font-weight: 800;
  color: #111;
  text-transform: lowercase;
}

.info-card p {
  margin: 0;
  font-size: 20px;
  line-height: 1.6;
  color: rgba(0, 0, 0, 0.68);
}

.action-row {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.secondary-btn,
.primary-btn {
  border: none;
  border-radius: 999px;
  padding: 16px 28px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
}

.secondary-btn:disabled {
  opacity: 0.7;
  cursor: wait;
}

.secondary-btn {
  background: #f2d3ac;
  color: #201818;
}

.primary-btn {
  background: #111;
  color: #fff;
}

@media (max-width: 1100px) {
  .result-content {
    grid-template-columns: 1fr;
  }

  .image-box {
    aspect-ratio: 16 / 10;
  }
}

@media (max-width: 768px) {
  .result-page {
    padding: 14px;
  }

  .result-shell {
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

  .word-card {
    min-height: 350px;
    border-radius: 26px;
  }

  .word-letter {
    font-size: 48px;
  }

  .phonetic {
    font-size: 22px;
  }

  .meaning-cn {
    font-size: 40px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-card {
    min-height: auto;
    padding: 20px;
  }

  .info-card h3 {
    font-size: 20px;
  }

  .info-card p {
    font-size: 17px;
  }

  .action-row {
    flex-direction: column;
  }

  .secondary-btn,
  .primary-btn,
  .retake-btn {
    width: 100%;
  }
}
</style>
