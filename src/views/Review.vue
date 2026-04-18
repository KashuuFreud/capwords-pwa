<template>
  <div class="review-page">
    <div class="review-card">
      <section class="top-section">
        <div class="top-row">
          <h1 class="page-title">Review</h1>

          <div class="top-right">
            <img
              :src="calendarIcon"
              alt="calendar"
              class="calendar-icon"
            />

            <button class="back-btn" @click="goBackHome">
              <span>Back</span>
              <span>-></span>
            </button>
          </div>
        </div>

        <div class="divider"></div>

        <h2 class="headline">let's see what did we learn!</h2>

        <div class="divider"></div>

        <div class="filter-row">
          <button
            class="filter-btn"
            :class="{ active: activeTab === 'all' }"
            @click="activeTab = 'all'"
          >
            All
          </button>

          <button
            class="filter-btn reviewing"
            :class="{ active: activeTab === 'reviewing' }"
            @click="activeTab = 'reviewing'"
          >
            Reviewing
          </button>

          <button
            class="filter-btn reviewed"
            :class="{ active: activeTab === 'reviewed' }"
            @click="activeTab = 'reviewed'"
          >
            Reviewed
          </button>
        </div>
      </section>

      <section class="cards-section">
        <div
          v-for="item in filteredCards"
          :key="item.id"
          class="learn-card"
        >
          <div class="card-top">
            <div class="wave-line"></div>

            <div class="card-icon" aria-hidden="true">
              {{ item.word?.slice(0, 1)?.toUpperCase() || '?' }}
            </div>

            <div v-if="item.wordCn" class="corner-tag">{{ item.wordCn }}</div>
          </div>

          <div class="card-bottom">
            <h3 class="card-title">{{ item.word }}</h3>
            <p class="card-desc">{{ item.wordCn || item.translation || 'No translation yet.' }}</p>
          </div>
        </div>

        <div v-if="!loading && !filteredCards.length" class="empty-card">
          <h3 class="card-title">No words yet</h3>
          <p class="card-desc">Save words to your account first, then they will appear here.</p>
        </div>
      </section>

      <section class="learn-more-section">
        <div class="section-divider"></div>

        <h2 class="learn-more-title">Learn more</h2>

        <p class="learn-more-intro">
          Our platform turns your photos into interactive English learning tools.
          Snap or upload any image, and we'll extract key vocabulary, generate
          real-life dialogues, and create personalized practice exercises tailored
          to your level. These pages will guide you through all the features you
          need to master English effectively.
        </p>

        <div class="guide-grid">
          <div class="guide-item">
            <h3>GUIDE - Vocabulary Extraction</h3>
            <p>
              Our AI automatically identifies objects, actions, and scenes from
              your photos, then extracts high-frequency English words and phrases.
              No more manual lookup - learn the vocabulary you actually see and use
              in daily life, with definitions and example sentences built right in.
            </p>
          </div>

          <div class="guide-item">
            <h3>GUIDE - Auto Contextual Translation</h3>
            <p>
              Get instant, context-aware translations for every element in your
              photo. The system adapts to different scenarios (travel, work,
              daily life) to ensure accurate, natural English expressions,
              helping you understand not just the words, but how to use them correctly.
            </p>
          </div>

          <div class="guide-item">
            <h3>Core Feature - Pronunciation Practice</h3>
            <p>
              Listen to native-speaker audio for every word and phrase extracted
              from your photos. Practice your pronunciation with real-time feedback,
              and compare your voice to the standard recording to improve clarity
              and intonation.
            </p>
          </div>

          <div class="guide-item">
            <h3>Core Feature - Progress Tracking & Custom Learning</h3>
            <p>
              Track your learning journey with personalized stats: word mastery,
              practice completion rates, and weekly goals. Customize your practice
              by difficulty level and topic, so you can focus on the areas that
              matter most for your English growth.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWordStore } from '../store/wordStore'
import calendarIcon from '../assets/icons/calendar.png'

const router = useRouter()
const wordStore = useWordStore()
const activeTab = ref('all')

const loading = computed(() => wordStore.loading)

const filteredCards = computed(() => {
  if (activeTab.value === 'reviewing') return wordStore.reviewingWords
  if (activeTab.value === 'reviewed') return wordStore.reviewedWords
  return wordStore.allWords
})

onMounted(async () => {
  try {
    await wordStore.fetchWordList()
  } catch (error) {
    console.error('Failed to load review list:', error)
  }
})

const goBackHome = () => {
  router.push('/')
}
</script>

<style scoped>
.review-page {
  min-height: 100vh;
  background: #d8e1cf;
  padding: 24px;
  box-sizing: border-box;
}

.review-card {
  max-width: 1450px;
  margin: 0 auto;
  background: #77c39e;
  border-radius: 42px;
  padding: 34px 42px 50px;
  box-sizing: border-box;
  overflow: hidden;
}

.top-section {
  position: relative;
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.page-title {
  margin: 0;
  font-size: 40px;
  font-weight: 800;
  color: #111;
}

.top-right {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 250px;
  justify-content: flex-end;
}

.calendar-icon {
  width: 140px;
  height: 140px;
  object-fit: contain;
  display: block;
  margin-right: -24px;
  margin-top: -6px;
  z-index: 2;
}

.back-btn {
  border: none;
  background: #f2efb2;
  color: #2b2618;
  padding: 12px 18px;
  border-radius: 999px;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
  margin-top: 22px;
}

.divider {
  height: 2px;
  background: rgba(255, 245, 210, 0.7);
  margin: 18px 0 42px;
}

.headline {
  margin: 0;
  text-align: center;
  font-size: 42px;
  font-weight: 800;
  color: #111;
}

.filter-row {
  display: flex;
  justify-content: flex-end;
  gap: 18px;
  margin-top: 28px;
}

.filter-btn {
  border: none;
  padding: 12px 18px;
  border-radius: 999px;
  font-size: 18px;
  font-weight: 700;
  background: #f7efb8;
  color: #5b4d1f;
  cursor: pointer;
}

.filter-btn.reviewing {
  background: #ebc95b;
}

.filter-btn.reviewed {
  background: #e87b34;
}

.filter-btn.active {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

.cards-section {
  margin-top: 42px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.learn-card,
.empty-card {
  border-radius: 30px;
  overflow: hidden;
  background: transparent;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.card-top {
  position: relative;
  height: 200px;
  background: #e7d37a;
  overflow: hidden;
}

.card-top::before {
  content: '';
  position: absolute;
  left: 28px;
  bottom: 16px;
  width: 96px;
  height: 96px;
  border: 8px solid rgba(223, 172, 116, 0.45);
  border-radius: 40% 45% 42% 38%;
}

.card-top::after {
  content: '';
  position: absolute;
  right: -10px;
  top: 42px;
  width: 92px;
  height: 92px;
  background: #e8bfd1;
  clip-path: polygon(100% 0, 0 100%, 100% 100%);
}

.wave-line {
  position: absolute;
  left: 0;
  top: 26px;
  width: 170px;
  height: 14px;
  background: repeating-radial-gradient(
    circle at 8px 12px,
    transparent 0 8px,
    #f8d8cd 8px 10px
  );
  background-size: 24px 14px;
}

.card-icon {
  position: absolute;
  left: 50%;
  top: 52%;
  transform: translate(-50%, -50%);
  width: 62px;
  height: 62px;
  color: #4b0822;
  font-size: 42px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.corner-tag {
  position: absolute;
  right: 70px;
  bottom: 24px;
  font-size: 56px;
  color: rgba(255, 255, 255, 0.82);
  transform: rotate(-28deg);
  pointer-events: none;
}

.card-bottom,
.empty-card {
  background: #e87a3b;
  padding: 28px 24px 20px;
  min-height: 100px;
  box-sizing: border-box;
  flex: 1;
}

.card-title {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 800;
  color: #111;
}

.card-desc {
  margin: 0;
  font-size: 15px;
  line-height: 1.5;
  color: #3d2f24;
}

.learn-more-section {
  margin-top: 60px;
}

.section-divider {
  height: 2px;
  background: rgba(255, 245, 210, 0.45);
  margin-bottom: 42px;
}

.learn-more-title {
  margin: 0;
  text-align: center;
  font-size: 52px;
  font-weight: 800;
  color: #111;
}

.learn-more-intro {
  max-width: 980px;
  margin: 24px auto 0;
  text-align: center;
  font-size: 16px;
  line-height: 1.8;
  color: #355145;
}

.guide-grid {
  margin-top: 70px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px 80px;
}

.guide-item h3 {
  margin: 0 0 14px;
  font-size: 18px;
  font-weight: 800;
  color: #12241f;
}

.guide-item p {
  margin: 0;
  font-size: 15px;
  line-height: 1.8;
  color: #355145;
}

@media (max-width: 1024px) {
  .review-page {
    padding: 16px;
  }

  .review-card {
    padding: 24px 24px 36px;
    border-radius: 30px;
  }

  .page-title {
    font-size: 34px;
  }

  .headline {
    font-size: 34px;
  }

  .calendar-icon {
    width: 110px;
    height: 110px;
    margin-right: -18px;
  }

  .cards-section {
    grid-template-columns: 1fr;
  }

  .guide-grid {
    grid-template-columns: 1fr;
    gap: 34px;
  }

  .learn-more-title {
    font-size: 40px;
  }
}

@media (max-width: 768px) {
  .review-page {
    padding: 10px;
  }

  .review-card {
    padding: 18px 16px 26px;
    border-radius: 24px;
  }

  .top-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .top-right {
    width: 100%;
    justify-content: flex-end;
    min-width: 0;
  }

  .page-title {
    font-size: 28px;
  }

  .headline {
    font-size: 28px;
    line-height: 1.2;
  }

  .divider {
    margin: 14px 0 24px;
  }

  .calendar-icon {
    width: 92px;
    height: 92px;
    margin-right: -10px;
    margin-top: 0;
  }

  .back-btn {
    font-size: 15px;
    padding: 10px 14px;
    margin-top: 16px;
  }

  .filter-row {
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .filter-btn {
    font-size: 15px;
    padding: 10px 14px;
  }

  .cards-section {
    margin-top: 28px;
    gap: 18px;
  }

  .card-top {
    height: 160px;
    flex-shrink: 0;
  }

  .card-icon {
    width: 50px;
    height: 50px;
    font-size: 34px;
  }

  .corner-tag {
    font-size: 34px;
    right: 46px;
    bottom: 22px;
  }

  .card-bottom,
  .empty-card {
    padding: 20px 18px 18px;
  }

  .card-title {
    font-size: 18px;
  }

  .card-desc {
    font-size: 14px;
  }

  .learn-more-section {
    margin-top: 40px;
  }

  .section-divider {
    margin-bottom: 28px;
  }

  .learn-more-title {
    font-size: 32px;
  }

  .learn-more-intro,
  .guide-item p {
    font-size: 14px;
  }

  .guide-grid {
    margin-top: 36px;
    gap: 24px;
  }
}
</style>
