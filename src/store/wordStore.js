import { defineStore } from 'pinia'
import {
  recognizeWordByImage,
  addWordToVocab,
  deleteVocabWords,
  getVocabByCategory,
  getVocabCategories,
  getWordList,
  getWordDetail,
  toggleWordCollect,
  getCollectWordList
} from '@/services'

export const useWordStore = defineStore('word', {
  state: () => ({
    wordList: [],            // 单词列表
    wordDetail: null,        // 单词详情
    collectList: [],         // 收藏列表
    vocabCategories: [],     // 单词分类列表
    categoryWordList: [],    // 按分类筛选的单词列表
    loading: false          // 加载状态
  }),

  actions: {
    // 拍照识词
    async recognizeImageWord(formData) {
      try {
        return await recognizeWordByImage(formData)
      } catch (err) {
        console.error('拍照识词失败', err)
      }
    },

    // 添加单词到词汇本
    async addWord(data) {
      try {
        return await addWordToVocab(data)
      } catch (err) {
        console.error('添加单词失败', err)
      }
    },

    // 删除单词（单个/批量）
    async deleteWords(data) {
      try {
        return await deleteVocabWords(data)
      } catch (err) {
        console.error('删除单词失败', err)
      }
    },

    // 获取所有单词分类
    async fetchVocabCategories() {
      try {
        const data = await getVocabCategories()
        this.vocabCategories = data
      } catch (err) {
        console.error('获取单词分类失败', err)
      }
    },

    // 根据分类ID获取单词
    async fetchVocabByCategory(categoryId) {
      try {
        const data = await getVocabByCategory(categoryId)
        this.categoryWordList = data
      } catch (err) {
        console.error('按分类获取单词失败', err)
      }
    },

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