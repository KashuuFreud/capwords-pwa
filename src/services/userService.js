import service from './api'

function normalizeAccount(account) {
  const value = (account || '').trim()
  if (!value) return ''
  if (value.includes('@')) return value
  return `${value}@snapword.local`
}

export function userLogin(data) {
  return service({
    url: '/user/login',
    method: 'post',
    data: {
      username: data.account,
      email: normalizeAccount(data.account),
      password: data.password
    }
  })
}

export function userRegister(data) {
  return service({
    url: '/user/register',
    method: 'post',
    data: {
      username: data.account,
      email: normalizeAccount(data.email || data.account),
      password: data.password
    }
  })
}

export function getUserInfo() {
  return service({
    url: '/user/info',
    method: 'get'
  })
}

export function userLogout() {
  return service({
    url: '/user/logout',
    method: 'post'
  })
}
