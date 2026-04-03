<template>
  <div class="flip-card-container">
    <div v-if="currentWord" class="flip-card" @click="flipCard" :class="{ flipped: isFlipped }">
      <!-- 正面：英文 -->
      <div class="card-front">
        <h2>{{ currentWord.english }}</h2>
        <p class="phonetic">{{ currentWord.pronunciation }}</p>
        <p class="tip">点击查看释义</p>
      </div>
      <!-- 背面：中文+例句 -->
      <div class="card-back">
        <h3>{{ currentWord.chinese }}</h3>
        <p v-if="currentWord.example" class="example">{{ currentWord.example }}</p>
        <div class="action-btns">
          <button @click.stop="handleReview(false)" class="no-btn">没记住</button>
          <button @click.stop="handleReview(true)" class="yes-btn">记住了</button>
        </div>
      </div>
    </div>
    <div v-else class="empty-tip">🎉 今日复习已完成！</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useReviewStore } from '@/stores/reviewStore'

const reviewStore = useReviewStore()
const currentWord = ref(null)
const isFlipped = ref(false)
const todayList = computed(() => reviewStore.todayReviewList)

// 初始化：获取今日复习列表
onMounted(async () => {
  await reviewStore.fetchTodayReview()
  nextWord()
})

// 下一个单词
const nextWord = () => {
  isFlipped.value = false
  currentWord.value = todayList.value[0] || null
}

// 翻卡
const flipCard = () => {
  isFlipped.value = !isFlipped.value
}

// 提交复习结果
const handleReview = async (remember) => {
  if (!currentWord.value) return
  await reviewStore.submitRecordWithAlgorithm(currentWord.value.id, remember)
  // 从列表移除当前单词
  reviewStore.todayReviewList.shift()
  nextWord()
}
</script>

<style scoped>
.flip-card-container { max-width: 500px; margin: 40px auto; perspective: 1000px; }
.flip-card { width: 100%; height: 350px; position: relative; transform-style: preserve-3d; transition: transform 0.6s; cursor: pointer; }
.flip-card.flipped { transform: rotateY(180deg); }
.card-front, .card-back {
  position: absolute; width: 100%; height: 100%; backface-visibility: hidden;
  border-radius: 16px; padding: 40px; box-sizing: border-box;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.card-front { background: #fff; }
.card-back { background: #f0f9ff; transform: rotateY(180deg); }
h2 { font-size: 32px; margin: 0; }
.phonetic { color: #666; font-size: 18px; margin: 10px 0; }
.tip { color: #999; margin-top: 20px; }
h3 { font-size: 24px; margin: 0; }
.example { color: #666; margin: 15px 0; text-align: center; }
.action-btns { display: flex; gap: 20px; margin-top: 30px; }
.no-btn { padding: 10px 24px; background: #f56c6c; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.yes-btn { padding: 10px 24px; background: #67c23a; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.empty-tip { text-align: center; font-size: 20px; color: #67c23a; padding: 40px; }
</style>