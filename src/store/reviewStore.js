import { defineStore } from 'pinia'
import { submitReviewResult, getReviewStats, toggleReviewWordStatus } from '@/services'

export const useReviewStore = defineStore('review', {
  state: () => ({
    reviewStats: null
  }),

  actions: {
    async submitReview(data) {
      try {
        return await submitReviewResult(data)
      } catch (err) {
        console.error('Failed to submit review result:', err)
        throw err
      }
    },

    async fetchReviewStats() {
      try {
        const res = await getReviewStats()
        this.reviewStats = res
        return res
      } catch (err) {
        console.error('Failed to fetch review stats:', err)
        throw err
      }
    },

    async toggleReviewStatus(wordId) {
      try {
        return await toggleReviewWordStatus(wordId)
      } catch (err) {
        console.error('Failed to toggle review status:', err)
        throw err
      }
    }
  }
})
