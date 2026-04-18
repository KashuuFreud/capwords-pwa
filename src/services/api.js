import axios from 'axios'

function getAuthToken() {
  try {
    const storedToken = localStorage.getItem('CAPWORDS_token')
    if (storedToken) {
      return JSON.parse(storedToken)
    }
  } catch (error) {
    console.error('Failed to parse stored token:', error)
  }

  return localStorage.getItem('token') || localStorage.getItem('capwords_token') || ''
}

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000
})

service.interceptors.request.use(
  config => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    config.headers['X-User-Type'] = 'child'
    return config
  },
  error => Promise.reject(error)
)

service.interceptors.response.use(
  response => response.data,
  error => {
    const detail = error.response?.data?.detail
    const backendError = error.response?.data?.error

    let message = detail || backendError || 'Request failed, please try again.'

    if (error.message?.includes('timeout')) {
      message = 'Request timed out, please try again.'
    } else if (!error.response) {
      message = 'Network error, please check the backend connection.'
    }

    return Promise.reject(new Error(message))
  }
)

export default service
