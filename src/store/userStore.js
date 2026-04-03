import { defineStore } from 'pinia'
import {
  userLogin,
  userRegister,
  getUserInfo,
  userLogout   // 修复：加入正确的登出接口
} from '@/services'

import { setStorage, getStorage, removeStorage } from '@/utils/storage'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: getStorage('token') || ''
  }),

  actions: {
    // 登录
    async login(data) {
      const res = await userLogin(data)
      this.token = res.token
      setStorage('token', res.token)
      return res
    },

    // 注册
    async register(data) {
      return await userRegister(data)
    },

    // 获取用户信息
    async fetchUserInfo() {
      try {
        const data = await getUserInfo()
        this.userInfo = data
        setStorage('userInfo', data)
      } catch (err) {
        this.userInfo = getStorage('userInfo')
        console.error('获取用户信息失败，使用本地缓存')
      }
    },

    // 登出（修复：调用后端接口 + 清理缓存）
    async logout() {
      try {
        await userLogout() // 调用后端登出
      } catch (err) {
        console.error('后端登出失败，但仍清理本地缓存')
      } finally {
        this.token = ''
        this.userInfo = null
        removeStorage('token')
        removeStorage('userInfo')
      }
    },

    // 同步本地数据
    async syncLocalDataToBackend() {
      try {
        console.log('登录成功 → 同步本地缓存数据到后端')
      } catch (err) {
        console.error('同步失败', err)
      }
    }
  }
})