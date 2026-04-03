import { defineStore } from 'pinia'
import {
  getUnreviewedWords,
  getTodayReviewList,
  submitReviewResult,
  getReviewStats,
  getReviewHistory
} from '@/services/reviewService'

import {
  getNextReviewTime,
  updateReviewStage,
  filterTodayReviews
} from '@/utils/reviewAlgorithm'

export const useReviewStore = defineStore('review', {
  state: () => ({
    todayReviewList: [],    // 今日复习列表
    unreviewedWords: [],    // 未复习单词（通用版，无儿童特殊逻辑）
    reviewStats: null,      // 复习统计
    reviewHistory: []       // 复习历史
  }),

  actions: {
    // 获取未复习单词
    async fetchUnreviewedWords() {
      try {
        const data = await getUnreviewedWords()
        this.unreviewedWords = data
      } catch (err) {
        console.error('获取未复习单词失败', err)
      }
    },

    // 获取今日复习列表
    async fetchTodayReview() {
      try {
        const data = await getTodayReviewList()
        this.todayReviewList = data
      } catch (err) {
        console.error('获取今日复习列表失败', err)
      }
    },

    // 提交复习结果 + 艾宾浩斯算法
    async submitRecordWithAlgorithm(wordId, remember) {
      try {
        const word = this.todayReviewList.find(item => item.id === wordId)
        if (!word) return false

        const newStage = updateReviewStage(word.stage || 0, remember)
        const nextReviewTime = getNextReviewTime(newStage)

        // 按接口要求提交
        await submitReviewResult({
          wordId,
          isCorrect: remember
        })

        // 本地更新
        word.stage = newStage
        word.nextReviewTime = nextReviewTime

        return true
      } catch (err) {
        console.error('提交复习结果失败', err)
        return false
      }
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

    // 获取复习历史（分页）
    async fetchReviewHistory(params) {
      try {
        const data = await getReviewHistory(params)
        this.reviewHistory = data
      } catch (err) {
        console.error('获取复习历史失败', err)
      }
    },

    // 筛选今天需要复习的单词
    filterTodayReviewWords(wordList) {
      return filterTodayReviews(wordList)
    }
  }
})