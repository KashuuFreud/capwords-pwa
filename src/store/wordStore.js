import { defineStore } from 'pinia'
import {
  recognizeWordByImage,
  addWordToVocab,
  getWordList,
  getWordDetail,
  toggleCollect,         // 收藏/取消收藏
  toggleReviewStatus     // 切换复习状态
} from '@/services'

export const useWordStore = defineStore('word', {
  state: () => ({
    wordList: [],        // 所有加入单词本的单词（已收藏）
    wordDetail: null,    // 当前打开的单词详情
    loading: false       // 加载状态
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

    // 2. 添加单词到单词本（拍照识别后调用）
    async addWord(data) {
      try {
        const res = await addWordToVocab(data)
        if (res) {
          // 新加入单词：已收藏 + 未复习
          this.wordList.push({
            ...data,
            id: res.id,
            isCollected: true,    // 已收藏 → 出现在 All
            isReviewed: false     // 未复习 → 出现在 Reviewing
          })
        }
        return res
      } catch (err) {
        console.error('添加单词失败', err)
      }
    },

    // 3. 获取单词本列表
    async fetchWordList(params) {
      this.loading = true
      try {
        const data = await getWordList(params)
        // 自动补全状态字段，保证前端不报错
        this.wordList = data.map(word => ({
          ...word,
          isCollected: word.isCollected ?? true,
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
        this.wordDetail = {
          ...data,
          isCollected: data.isCollected ?? true,
          isReviewed: data.isReviewed ?? false
        }
      } catch (err) {
        console.error('获取单词详情失败', err)
      }
    },

    // ==============================
    // 5. 【核心】切换收藏状态（WordCard 星星）
    // 控制：加入 All / 移出 All
    // ==============================
    async toggleWordCollect(wordId) {
      try {
        await toggleCollect(wordId)

        // 更新本地列表状态
        const target = this.wordList.find(w => w.id === wordId)
        if (target) target.isCollected = !target.isCollected

        // 更新详情页
        if (this.wordDetail?.id === wordId) {
          this.wordDetail.isCollected = !this.wordDetail.isCollected
        }

        return true
      } catch (err) {
        console.error('收藏状态切换失败', err)
        return false
      }
    },

    // ==============================
    // 6. 【核心】切换复习状态（FlipCard 对号）
    // 控制：Reviewing ↔ Reviewed
    // ==============================
    async toggleWordReviewStatus(wordId) {
      try {
        await toggleReviewStatus(wordId)

        const target = this.wordList.find(w => w.id === wordId)
        if (target) target.isReviewed = !target.isReviewed

        if (this.wordDetail?.id === wordId) {
          this.wordDetail.isReviewed = !this.wordDetail.isReviewed
        }

        return true
      } catch (err) {
        console.error('复习状态切换失败', err)
        return false
      }
    }
  },

  // ==============================
  // 三个分类严格对应页面
  // ==============================
  getters: {
    // All：只显示已收藏的单词
    allWords: (state) => state.wordList.filter(w => w.isCollected),

    // Reviewing：已收藏 + 未复习
    reviewingWords: (state) => state.wordList.filter(w => w.isCollected && !w.isReviewed),

    // Reviewed：已收藏 + 已复习
    reviewedWords: (state) => state.wordList.filter(w => w.isCollected && w.isReviewed)
  }
})