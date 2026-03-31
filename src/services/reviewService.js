import service from './api'

// -------------------------- 复习相关接口 --------------------------
// 获取今日需要复习的单词列表
export function getTodayReviewList() {
  return service({
    url: '/review/today',
    method: 'get'
  })
}

// 提交复习记录（用户复习完单词后调用）
export function submitReviewRecord(data) {
  return service({
    url: '/review/submit',
    method: 'post',
    data // 复习数据：wordId、是否记住、复习时间等
  })
}

// 获取复习统计（学习天数、总复习数、掌握率等）
export function getReviewStats() {
  return service({
    url: '/review/stats',
    method: 'get'
  })
}

// 获取复习历史记录
export function getReviewHistory(params) {
  return service({
    url: '/review/history',
    method: 'get',
    params // 分页参数
  })
}