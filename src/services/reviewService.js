import service from './api'

// 仅保留你业务需要的核心接口
// 1. 提交复习结果（标记单词已复习/未复习）
export function submitReviewResult(data) {
  return service({
    url: '/review/submit',
    method: 'post',
    data // { wordId, isCorrect: true/false }
  })
}

// 2. 获取复习统计（可选，用于个人主页展示学习数据）
export function getReviewStats() {
  return service({
    url: '/review/stats',
    method: 'get'
  })
}