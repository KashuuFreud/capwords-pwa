import { defineStore } from 'pinia'
import {
  userLogin,
  userRegister,
  getUserInfo,
  updateUserInfo
} from '@/services'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,    // 用户信息
    token: localStorage.getItem('token') || ''
  }),

  actions: {
    // 登录
    async login(data) {
      const res = await userLogin(data)
      this.token = res.token
      localStorage.setItem('token', res.token)
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
      } catch (err) {
        console.error('获取用户信息失败', err)
      }
    },

    // 更新用户信息
    async updateInfo(data) {
      return await updateUserInfo(data)
    }
  }
})