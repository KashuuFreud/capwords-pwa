import { defineStore } from 'pinia'
import {
  userLogin,
  userRegister,
  getUserInfo,
  userLogout
} from '@/services'

import { setStorage, getStorage, removeStorage } from '@/utils/storage'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: getStorage('userInfo') || null,  // 初始化直接读取缓存
    token: getStorage('token') || ''
  }),

  getters: {
    // 快捷判断登录状态（页面直接用）
    isLoggedIn: (state) => !!state.token && !!state.userInfo
  },

  actions: {
    // 登录（优化：登录后自动拉取用户信息）
    async login(data) {
      const res = await userLogin(data)
      this.token = res.token
      setStorage('token', res.token)
      // 登录成功后自动拉取用户信息，同步到state和缓存
      await this.fetchUserInfo()
      return res
    },

    // 注册
    async register(data) {
      return await userRegister(data)
    },

    // 获取用户信息（优化：强制同步缓存）
    async fetchUserInfo() {
      try {
        const data = await getUserInfo()
        this.userInfo = data
        setStorage('userInfo', data)
        return data
      } catch (err) {
        console.error('获取用户信息失败，使用本地缓存', err)
        // 兜底：如果接口失败，保持本地缓存
        this.userInfo = getStorage('userInfo') || null
        return this.userInfo
      }
    },

    // 登出（完全清理状态+缓存）
    async logout() {
      try {
        await userLogout()
      } catch (err) {
        console.error('后端登出失败，仅清理本地缓存', err)
      } finally {
        this.token = ''
        this.userInfo = null
        removeStorage('token')
        removeStorage('userInfo')
      }
    },

    // 同步本地数据到后端（登录成功后调用）
    async syncLocalData() {
      try {
        console.log('同步本地单词/复习数据到后端')
        // 后续可在这里调用wordStore的同步方法
        return true
      } catch (err) {
        console.error('同步失败', err)
        return false
      }
    }
  }
})