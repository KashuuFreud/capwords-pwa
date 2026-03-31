import service from './api'

// -------------------------- 用户相关接口 --------------------------
// 用户登录
export function userLogin(data) {
  return service({
    url: '/user/login',
    method: 'post',
    data // 登录参数：username、password
  })
}

// 用户注册
export function userRegister(data) {
  return service({
    url: '/user/register',
    method: 'post',
    data // 注册参数：username、password、email等
  })
}

// 获取用户信息（学习进度、个人资料）
export function getUserInfo() {
  return service({
    url: '/user/info',
    method: 'get'
  })
}

// 更新用户信息
export function updateUserInfo(data) {
  return service({
    url: '/user/update',
    method: 'post',
    data
  })
}