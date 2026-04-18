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
    userInfo: getStorage('userInfo') || null,
    token: getStorage('token') || ''
  }),

  getters: {
    isLoggedIn: state => !!state.token && !!state.userInfo
  },

  actions: {
    async login(data) {
      localStorage.removeItem('savedWord')
      localStorage.removeItem('wordResult')
      localStorage.removeItem('capturedImage')
      localStorage.removeItem('capturedImageName')

      const res = await userLogin(data)
      const token = res.access_token || res.token || ''

      this.token = token
      setStorage('token', token)
      await this.fetchUserInfo()

      return res
    },

    async register(data) {
      return userRegister(data)
    },

    async fetchUserInfo() {
      try {
        const data = await getUserInfo()
        this.userInfo = data
        setStorage('userInfo', data)
        return data
      } catch (err) {
        console.error('Failed to fetch user info:', err)
        this.userInfo = getStorage('userInfo') || null
        return this.userInfo
      }
    },

    async logout() {
      try {
        await userLogout()
      } catch (err) {
        console.error('Backend logout failed:', err)
      } finally {
        this.token = ''
        this.userInfo = null
        removeStorage('token')
        removeStorage('userInfo')
        localStorage.removeItem('capwords_token')
        localStorage.removeItem('savedWord')
        localStorage.removeItem('wordResult')
        localStorage.removeItem('capturedImage')
        localStorage.removeItem('capturedImageName')
        localStorage.removeItem('reviewWords')
        localStorage.removeItem('capwords_words_count')
      }
    },

    async syncLocalData() {
      return true
    }
  }
})
