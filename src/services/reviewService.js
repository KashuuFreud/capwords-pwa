import service from './api'

// -------------------------- 复习相关接口 --------------------------
// 1. 获取未复习的单词（核心修改：儿童场景优先返回未复习单词）
export function getUnreviewedWords() {
  return service({
    url: '/review/unreviewed',
    method: 'get'
  })
}

// 2. 提交复习结果（核心修改：更新复习次数+复习状态）
export function submitReviewResult(data) {
  return service({
    url: '/review/submit',
    method: 'post',
    data // data结构：{ wordId, isCorrect: true/false }
  })
}

// 3. 原有接口优化（适配儿童场景）
// 获取今日需要复习的单词列表
export function getTodayReviewList() {
  return service({
    url: '/review/today',
    method: 'get'
  })
}

// 获取复习统计（儿童场景：识别总数、复习次数、掌握单词数）
export function getReviewStats() {
  return service({
    url: '/review/stats',
    method: 'get'
  })
}

// 获取复习历史记录（分页）
export function getReviewHistory(params) {
  return service({
    url: '/review/history',
    method: 'get',
    params // { page, pageSize }
  })
}