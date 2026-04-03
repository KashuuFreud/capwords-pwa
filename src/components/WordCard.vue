<template>
  <div class="word-card">
    <div class="card-header">
      <h3>{{ word.english }}</h3>
      <button
        @click="handleCollect"
        class="collect-btn"
        :class="{ collected: word.isCollected }"
      >
        {{ word.isCollected ? '已收藏' : '收藏' }}
      </button>
    </div>
    <p class="chinese">{{ word.chinese }}</p>
    <p v-if="word.pronunciation" class="phonetic">音标：{{ word.pronunciation }}</p>
    <p v-if="word.example" class="example">例句：{{ word.example }}</p>
    <div class="card-footer">
      <span class="category">{{ word.category }}</span>
      <button @click="handleDelete" class="delete-btn">删除</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useWordStore } from '@/stores/wordStore'

const props = defineProps({
  word: { type: Object, required: true }
})

const wordStore = useWordStore()

// 收藏/取消收藏
const handleCollect = async () => {
  await wordStore.fetchToggleCollect(props.word.id)
}

// 删除单词
const handleDelete = async () => {
  if (confirm('确定要删除这个单词吗？')) {
    await wordStore.deleteWords({ wordIds: [props.word.id] })
    // 刷新列表（父组件监听事件）
    window.dispatchEvent(new CustomEvent('wordDeleted'))
  }
}
</script>

<style scoped>
.word-card {
  border: 1px solid #e4e7ed; border-radius: 12px; padding: 20px;
  background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
h3 { margin: 0; font-size: 20px; color: #303133; }
.collect-btn {
  padding: 4px 12px; border: 1px solid #f56c6c; border-radius: 4px;
  background: transparent; color: #f56c6c; cursor: pointer;
}
.collect-btn.collected { background: #f56c6c; color: #fff; }
.chinese { font-size: 16px; color: #606266; margin: 8px 0; }
.phonetic, .example { color: #909399; font-size: 14px; margin: 5px 0; }
.card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; }
.category { color: #409eff; font-size: 13px; background: #ecf5ff; padding: 2px 8px; border-radius: 4px; }
.delete-btn {
  padding: 4px 12px; border: none; border-radius: 4px;
  background: #f56c6c; color: #fff; cursor: pointer;
}
</style>