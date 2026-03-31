import service from './api'

// -------------------------- 单词相关接口 --------------------------
// 获取单词列表（分页/全部）
export function getWordList(params) {
  return service({
    url: '/word/list',
    method: 'get',
    params // 分页参数：page、pageSize等
  })
}

// 根据ID获取单个单词详情
export function getWordDetail(wordId) {
  return service({
    url: `/word/detail/${wordId}`,
    method: 'get'
  })
}

// 收藏/取消收藏单词
export function toggleWordCollect(wordId) {
  return service({
    url: `/word/collect/${wordId}`,
    method: 'post'
  })
}

// 获取用户收藏的单词列表
export function getCollectWordList() {
  return service({
    url: '/word/collect/list',
    method: 'get'
  })
}