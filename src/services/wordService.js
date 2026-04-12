import service from './api'

// ============================
// 单词服务（适配：拍照识别 + 单词本 + 复习系统）
// 支持：isCollected（收藏）、isReviewed（复习状态）
// ============================

// 1. 拍照识词（上传图片识别单词）
export function recognizeWordByImage(formData) {
  return service({
    url: '/word/recognize',
    method: 'post',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 20000
  })
}

// 2. 添加单词到词汇本（拍照识别后使用）
// 自动设置：isCollected = true，isReviewed = false
export function addWordToVocab(data) {
  return service({
    url: '/word/add',
    method: 'post',
    data
  })
}

// 3. 获取单词列表（支持 All / Reviewing / Reviewed 分类）
// 传入参数示例：{ type: 'all' } / { type: 'reviewing' } / { type: 'reviewed' }
export function getWordList(params) {
  return service({
    url: '/word/list',
    method: 'get',
    params
  })
}

// 4. 获取单词详情（WordCard & FlipCard 共用）
export function getWordDetail(wordId) {
  return service({
    url: `/word/detail/${wordId}`,
    method: 'get'
  })
}

// 5. 切换收藏状态（WordCard 星星按钮）
// 控制：加入 All / 移出 All
export function toggleCollect(wordId) {
  return service({
    url: `/word/${wordId}/toggleCollect`,
    method: 'post'
  })
}

// 6. 切换复习状态（FlipCard 对号按钮）
// 控制：Reviewing ↔ Reviewed 互相切换
export function toggleReviewStatus(wordId) {
  return service({
    url: `/word/${wordId}/toggleReview`,
    method: 'post'
  })
}