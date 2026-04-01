import { defineStore } from 'pinia'
import {
  getTodayReviewList,
  submitReviewRecord,
  getReviewStats,
  getReviewHistory
} from '@/services'

// 引入复习算法
import {
  getNextReviewTime,
  updateReviewStage,
  filterTodayReviews
} from '@/utils/reviewAlgorithm'

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

    // 提交复习记录 + 自动应用艾宾浩斯算法
    async submitRecordWithAlgorithm(wordId, remember) {
      try {
        // 1. 找到当前单词
        const word = this.todayReviewList.find(item => item.id === wordId)
        if (!word) return

        // 2. 使用复习算法更新阶段和下次复习时间
        const newStage = updateReviewStage(word.stage || 0, remember)
        const nextReviewTime = getNextReviewTime(newStage)

        // 3. 提交到后端
        await submitReviewRecord({
          wordId,
          remember,
          stage: newStage,
          nextReviewTime
        })

        // 4. 本地更新数据
        word.stage = newStage
        word.nextReviewTime = nextReviewTime

        return true
      } catch (err) {
        console.error('提交复习记录失败', err)
        return false
      }
    },

    // 提交复习记录（原来的接口，保留）
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
    },

    // 算法：筛选今天需要复习的单词
    filterTodayReviewWords(wordList) {
      return filterTodayReviews(wordList)
    }
  }
})