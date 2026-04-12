import { defineStore } from 'pinia'
import { submitReviewResult, getReviewStats, toggleReviewStatus } from '@/services'

export const useReviewStore = defineStore('review', {
  state: () => ({
    reviewStats: null // 复习统计数据
  }),

  actions: {
    // 提交复习结果
    async submitReview(data) {
      try {
        return await submitReviewResult(data)
      } catch (err) {
        console.error('提交复习结果失败', err)
        return false
      }
    },

    // 获取复习统计数据
    async fetchReviewStats() {
      try {
        const res = await getReviewStats()
        this.reviewStats = res
        return res
      } catch (err) {
        console.error('获取复习统计失败', err)
      }
    },

    // 【核心】切换单词复习状态（供 FlipCard 对号调用）
    async toggleReviewStatus(wordId) {
      try {
        await toggleReviewStatus(wordId)
        return true
      } catch (err) {
        console.error('切换复习状态失败', err)
        return false
      }
    }
  },

  getters: {}
})