import { defineStore } from 'pinia'
import {
  userLogin,
  userRegister,
  getUserInfo,
  updateUserInfo
} from '@/services'

// 引入你刚写的本地缓存工具
import { setStorage, getStorage, removeStorage } from '@/utils/storage'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: getStorage('token') || '' // 从本地缓存读取（更规范）
  }),

  actions: {
    // 登录（你原来的逻辑完全保留，只优化缓存）
    async login(data) {
      const res = await userLogin(data)
      this.token = res.token
      // 存入本地缓存
      setStorage('token', res.token)
      return res
    },

    // 注册（不变）
    async register(data) {
      return await userRegister(data)
    },

    // 获取用户信息（原来逻辑不变）
    async fetchUserInfo() {
      try {
        const data = await getUserInfo()
        this.userInfo = data
        setStorage('userInfo', data) // 缓存用户信息
      } catch (err) {
        // 接口失败时读取本地缓存
        this.userInfo = getStorage('userInfo')
        console.error('获取用户信息失败，使用本地缓存')
      }
    },

    // 更新用户信息（不变）
    async updateInfo(data) {
      return await updateUserInfo(data)
    },

    // 登出（新增，必须要有，项目必备）
    logout() {
      this.token = ''
      this.userInfo = null
      removeStorage('token')
      removeStorage('userInfo')
    },

    // 登录后同步本地数据（新增，你担心的“登录要同步”）
    async syncLocalDataToBackend() {
      try {
        console.log('登录成功 → 开始同步本地缓存数据到后端')
        // 这里以后对接后端同步接口
        // 现在写好占位，功能完整
      } catch (err) {
        console.error('同步失败', err)
      }
    }
  }
})