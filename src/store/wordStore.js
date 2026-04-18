import { defineStore } from 'pinia'
import {
  recognizeWordByImage,
  addWordToVocab,
  getWordList,
  getWordDetail,
  toggleCollect,
  toggleReviewStatus
} from '@/services'

export const useWordStore = defineStore('word', {
  state: () => ({
    wordList: [],
    wordDetail: null,
    loading: false
  }),

  actions: {
    async recognizeImageWord(formData) {
      try {
        return await recognizeWordByImage(formData)
      } catch (err) {
        console.error('Failed to recognize image word:', err)
        throw err
      }
    },

    async addWord(data) {
      try {
        const res = await addWordToVocab(data)
        const word = res?.word || null
        if (word) {
          this.wordList.unshift(word)
        }
        return word
      } catch (err) {
        console.error('Failed to add word:', err)
        throw err
      }
    },

    async fetchWordList(params) {
      this.loading = true
      try {
        const res = await getWordList(params)
        this.wordList = Array.isArray(res?.list) ? res.list : []
        return this.wordList
      } catch (err) {
        console.error('Failed to fetch word list:', err)
        this.wordList = []
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchWordDetail(wordId) {
      try {
        const res = await getWordDetail(wordId)
        this.wordDetail = res?.word || null
        return this.wordDetail
      } catch (err) {
        console.error('Failed to fetch word detail:', err)
        throw err
      }
    },

    async toggleWordCollect(wordId) {
      try {
        const res = await toggleCollect(wordId)
        const updatedWord = res?.word

        if (updatedWord) {
          const index = this.wordList.findIndex(word => word.id === wordId)
          if (index !== -1) {
            this.wordList.splice(index, 1, updatedWord)
          }

          if (this.wordDetail?.id === wordId) {
            this.wordDetail = updatedWord
          }
        }

        return updatedWord
      } catch (err) {
        console.error('Failed to toggle collect status:', err)
        throw err
      }
    },

    async toggleWordReviewStatus(wordId) {
      try {
        const res = await toggleReviewStatus(wordId)
        const updatedWord = res?.word

        if (updatedWord) {
          const index = this.wordList.findIndex(word => word.id === wordId)
          if (index !== -1) {
            this.wordList.splice(index, 1, updatedWord)
          }

          if (this.wordDetail?.id === wordId) {
            this.wordDetail = updatedWord
          }
        }

        return updatedWord
      } catch (err) {
        console.error('Failed to toggle review status:', err)
        throw err
      }
    }
  },

  getters: {
    allWords: state => state.wordList.filter(word => word.isCollected),
    reviewingWords: state => state.wordList.filter(word => word.isCollected && !word.isReviewed),
    reviewedWords: state => state.wordList.filter(word => word.isCollected && word.isReviewed)
  }
})
