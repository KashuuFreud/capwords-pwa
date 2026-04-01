import { defineStore } from 'pinia'
import {
  getTodayReviewList,
  submitReviewRecord,
  getReviewStats,
  getReviewHistory
} from '@/services'

export const useReviewStore = defineStore('review', {
  state: () => ({
    todayReviewList: [],  // 今日复习列表
    reviewStats: null,    // 复习统计
    reviewHistory: []     // 复习历史
  }),

  actions: {
    // 获取今日复习列表
    async fetchTodayReview() {
      try {
        const data = await getTodayReviewList()
        this.todayReviewList = data
      } catch (err) {
        console.error('获取今日复习列表失败', err)
      }
    },

    // 提交复习记录
    async submitRecord(data) {
      return await submitReviewRecord(data)
    },

    // 获取复习统计
    async fetchReviewStats() {
      try {
        const data = await getReviewStats()
        this.reviewStats = data
      } catch (err) {
        console.error('获取复习统计失败', err)
      }
    },

    // 获取复习历史
    async fetchReviewHistory(params) {
      try {
        const data = await getReviewHistory(params)
        this.reviewHistory = data
      } catch (err) {
        console.error('获取复习历史失败', err)
      }
    }
  }
})