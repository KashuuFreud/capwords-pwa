import axios from 'axios'

// 1. 创建 axios 实例，统一配置基础URL、超时时间
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000 // 超时时间
})

// 2. 请求拦截器：发请求前统一处理
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    // 儿童端：添加请求标识，便于后端区分儿童/成人接口
    config.headers['X-User-Type'] = 'child'
    return config
  },
  error => {
    console.error('请求错误😟:', error)
    return Promise.reject(error)
  }
)

// 3. 响应拦截器：收到响应后统一处理（比如状态码判断、错误提示）
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      const childErrMsg = res.msg || '服务器开小差啦😜，再试一次吧～'
      console.error('接口错误:', childErrMsg)
      return Promise.reject(new Error(childErrMsg))
    }
    return res.data
  },
  error => {
    // 区分网络错误/超时，
    let errMsg = '网络有点慢哦💡，检查一下WiFi吧～'
    if (error.message.includes('timeout')) {
      errMsg = '等太久啦😝，重新试试吧～'
    }
    console.error('响应错误:', errMsg)
    return Promise.reject(new Error(errMsg))
  }
)

export default service