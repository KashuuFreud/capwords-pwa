// 本地缓存工具
const PREFIX = 'CAPWORDS_'

// 保存数据
export function setStorage(key, data) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(data))
    return true
  } catch (err) {
    console.error('缓存保存失败', err)
    return false
  }
}

// 获取数据
export function getStorage(key) {
  try {
    const data = localStorage.getItem(PREFIX + key)
    return data ? JSON.parse(data) : null
  } catch (err) {
    console.error('缓存读取失败', err)
    return null
  }
}

// 删除数据
export function removeStorage(key) {
  localStorage.removeItem(PREFIX + key)
}

// 清空所有缓存
export function clearStorage() {
  localStorage.clear()
}