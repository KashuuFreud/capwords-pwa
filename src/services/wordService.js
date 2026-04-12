import service from './api'

// -------------------------- 单词相关接口（精简版） --------------------------
// 1. 拍照识词（核心功能）
export function recognizeWordByImage(formData) {
  return service({
    url: '/word/recognize',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 20000
  })
}

// 2. 添加识别的单词到词汇本（核心功能）
export function addWordToVocab(data) {
  return service({
    url: '/word/add',
    method: 'post',
    data
  })
}

// 3. 获取单词列表（核心功能，用于All/Reviewing/Reviewed筛选）
export function getWordList(params) {
  return service({
    url: '/word/list',
    method: 'get',
    params
  })
}

// 4. 根据ID获取单个单词详情（核心功能，用于WordCard展示）
export function getWordDetail(wordId) {
  return service({
    url: `/word/detail/${wordId}`,
    method: 'get'
  })
}