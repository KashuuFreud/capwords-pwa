import service from './api'

// -------------------------- 单词相关接口 --------------------------
// 1. 拍照识词（对接OCR/物体识别接口）
export function recognizeWordByImage(formData) {
  return service({
    url: '/word/recognize',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 20000
  })
}

// 2. 添加识别的单词到词汇本
export function addWordToVocab(data) {
  return service({
    url: '/word/add',
    method: 'post',
    data
  })
}

// 3. 删除词汇本中的单词（单个/批量）
export function deleteVocabWords(data) {
  return service({
    url: '/word/delete',
    method: 'post',
    data
  })
}

// 4. 按类别获取词汇本单词
export function getVocabByCategory(categoryId) {
  return service({
    url: `/word/category/${categoryId}`,
    method: 'get'
  })
}

// 5. 获取所有词汇类别
export function getVocabCategories() {
  return service({
    url: '/word/categories',
    method: 'get'
  })
}

// 6. 获取单词列表（分页/全部）
export function getWordList(params) {
  return service({
    url: '/word/list',
    method: 'get',
    params
  })
}

// 7. 根据ID获取单个单词详情
export function getWordDetail(wordId) {
  return service({
    url: `/word/detail/${wordId}`,
    method: 'get'
  })
}

// 8. 收藏/取消收藏单词
export function toggleWordCollect(wordId) {
  return service({
    url: `/word/collect/${wordId}`,
    method: 'post'
  })
}

// 9. 获取用户收藏的单词列表
export function getCollectWordList() {
  return service({
    url: '/word/collect/list',
    method: 'get'
  })
}