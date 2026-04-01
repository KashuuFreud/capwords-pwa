import { defineStore } from 'pinia'
import {
  getWordList,
  getWordDetail,
  toggleWordCollect,
  getCollectWordList
} from '@/services'

export const useWordStore = defineStore('word', {
  state: () => ({
    wordList: [],        // 单词列表
    wordDetail: null,    // 单词详情
    collectList: [],     // 收藏列表
    loading: false       // 加载状态
  }),

  actions: {
    // 获取单词列表
    async fetchWordList(params) {
      this.loading = true
      try {
        const data = await getWordList(params)
        this.wordList = data
      } catch (err) {
        console.error('获取单词列表失败', err)
      } finally {
        this.loading = false
      }
    },

    // 获取单词详情
    async fetchWordDetail(wordId) {
      try {
        const data = await getWordDetail(wordId)
        this.wordDetail = data
      } catch (err) {
        console.error('获取单词详情失败', err)
      }
    },

    // 收藏/取消收藏单词
    async fetchToggleCollect(wordId) {
      try {
        await toggleWordCollect(wordId)
        // 可在这里刷新收藏列表
        await this.fetchCollectList()
      } catch (err) {
        console.error('收藏操作失败', err)
      }
    },

    // 获取收藏列表
    async fetchCollectList() {
      try {
        const data = await getCollectWordList()
        this.collectList = data
      } catch (err) {
        console.error('获取收藏列表失败', err)
      }
    }
  }
})