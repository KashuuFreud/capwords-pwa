import service from './api'

// ============================
// 复习相关接口（适配 FlipCard 对号切换：Reviewing ↔ Reviewed）
// ============================

// 1. 提交复习结果
export function submitReviewResult(data) {
  return service({
    url: '/review/submit',
    method: 'post',
    data // { wordId, isCorrect: true/false }
  })
}

// 2. 获取复习统计(后续可以扩展的功能)
export function getReviewStats() {
  return service({
    url: '/review/stats',
    method: 'get'
  })
}

// 3. FlipCard 核心：切换单词复习状态（未复习 ↔ 已复习）
export function toggleReviewStatus(wordId) {
  return service({
    url: `/review/${wordId}/toggleStatus`,
    method: 'post'
  })
}