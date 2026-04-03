import service from './api'

/**
 * 用户模块接口（统一用户体系，登录/注册/信息查询）
 * 所有接口返回 Promise，入参/出参格式与后端约定一致
 */

/**
 * 用户登录
 * @param {Object} data - 登录参数
 * @param {string} data.username - 用户名/手机号/邮箱
 * @param {string} data.password - 密码（加密/明文由后端约定）
 * @returns {Promise<Object>} 登录结果（含token、用户基础信息）
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
 * @param {Object} data - 注册参数
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @param {string} [data.email] - 邮箱（可选/必填由后端约定）
 * @param {string} [data.phone] - 手机号（可选）
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
 * 获取用户信息（统一返回：学习进度+个人资料，不区分角色）
 * @returns {Promise<Object>} 用户信息（id、username、avatar、learnStats等）
 */
export function getUserInfo() {
  return service({
    url: '/user/info',
    method: 'get'
  })
}

/**
 * 用户退出登录（核心补充，保证登录态完整性）
 * @returns {Promise<Object>} 退出结果
 */
export function userLogout() {
  return service({
    url: '/user/logout',
    method: 'post'
  })
}