import { defineStore } from 'pinia'
import {
  recognizeWordByImage,
  addWordToVocab,
  getWordList,
  getWordDetail
} from '@/services'

export const useWordStore = defineStore('word', {
  state: () => ({
    wordList: [],        // 所有加入单词本的单词
    wordDetail: null,    // 当前打开的单词详情
    loading: false       // 列表加载状态
  }),

  actions: {
    // 1. 拍照识词
    async recognizeImageWord(formData) {
      try {
        return await recognizeWordByImage(formData)
      } catch (err) {
        console.error('拍照识词失败', err)
      }
    },

    // 2. 加入单词本（默认未复习）
    async addWord(data) {
      try {
        const res = await addWordToVocab(data)
        if (res) {
          // 新单词默认isReviewed: false，自动进入Reviewing
          this.wordList.push({ ...data, id: res.id, isReviewed: false })
        }
        return res
      } catch (err) {
        console.error('添加单词失败', err)
      }
    },

    // 3. 获取单词本列表（所有单词）
    async fetchWordList(params) {
      this.loading = true
      try {
        const data = await getWordList(params)
        // 确保每个单词都有isReviewed字段，无则默认false
        this.wordList = data.map(word => ({
          ...word,
          isReviewed: word.isReviewed ?? false
        }))
      } catch (err) {
        console.error('获取单词列表失败', err)
      } finally {
        this.loading = false
      }
    },

    // 4. 获取单词详情
    async fetchWordDetail(wordId) {
      try {
        const data = await getWordDetail(wordId)
        this.wordDetail = { ...data, isReviewed: data.isReviewed ?? false }
      } catch (err) {
        console.error('获取单词详情失败', err)
      }
    },

    // 5. 标记单词已复习/未复习
    async updateWordReviewStatus(wordId, isReviewed) {
      try {
        // 更新单词列表中的状态
        const targetWord = this.wordList.find(w => w.id === wordId)
        if (targetWord) targetWord.isReviewed = isReviewed

        // 更新当前详情页的状态
        if (this.wordDetail?.id === wordId) {
          this.wordDetail.isReviewed = isReviewed
        }
        return true
      } catch (err) {
        console.error('更新复习状态失败', err)
        return false
      }
    }
  },

  // 6. 核心筛选：对应All/Reviewing/Reviewed（all = reviewing + reviewed）
  getters: {
    // 全部单词
    allWords: (state) => state.wordList,
    // 未复习（正在复习）的单词
    reviewingWords: (state) => state.wordList.filter(w => !w.isReviewed),
    // 已复习的单词
    reviewedWords: (state) => state.wordList.filter(w => w.isReviewed)
  }
})