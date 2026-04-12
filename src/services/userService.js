import service from './api'

/**
 * 用户模块接口（统一用户体系，登录/注册/信息查询）
 */

/**
 * 用户登录
 * @param {Object} data - 登录参数 { account, password }
 * @returns {Promise<Object>} 登录结果 { token, userInfo }
 */
export function userLogin(data) {
  return service({
    url: '/user/login',
    method: 'post',
    data
  })
}

/**
 * 用户注册
 * @param {Object} data - 注册参数 { id, account, password, confirmPassword }
 * @returns {Promise<Object>} 注册结果
 */
export function userRegister(data) {
  return service({
    url: '/user/register',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息（返回个人资料+学习统计）
 * @returns {Promise<Object>} 用户信息 { id, nickname, gender, grade, location, account }
 */
export function getUserInfo() {
  return service({
    url: '/user/info',
    method: 'get'
  })
}

/**
 * 用户退出登录
 * @returns {Promise<Object>} 退出结果
 */
export function userLogout() {
  return service({
    url: '/user/logout',
    method: 'post'
  })
}