import axios from 'axios'

// 1. 创建 axios 实例，统一配置基础URL、超时时间
const service = axios.create({
  // 开发环境用代理，生产环境换真实后端地址
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000 // 10秒超时
})

// 2. 请求拦截器：发请求前统一处理（比如加token、加载动画）
service.interceptors.request.use(
  config => {
    // 从localStorage拿token，加到请求头（后续登录功能用）
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    // 请求错误处理
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 3. 响应拦截器：收到响应后统一处理（比如状态码判断、错误提示）
service.interceptors.response.use(
  response => {
    const res = response.data
    // 后端约定：code=200 代表成功，其他代表业务错误
    if (res.code !== 200) {
      // 这里可以加全局错误提示（比如Element Plus的Message）
      console.error('接口错误:', res.msg || '请求失败')
      return Promise.reject(new Error(res.msg || '请求失败'))
    }
    // 成功的话直接返回data部分，不用每次都res.data.data
    return res.data
  },
  error => {
    // 网络错误、超时等处理
    console.error('响应错误:', error)
    // 可以加全局提示，比如“网络异常，请检查网络”
    return Promise.reject(error)
  }
)

export default service