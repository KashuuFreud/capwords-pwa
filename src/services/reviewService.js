import service from './api'

export function submitReviewResult(data) {
  return service({
    url: '/review/submit',
    method: 'post',
    data
  })
}

export async function getReviewStats() {
  const res = await service({
    url: '/word/list',
    method: 'get'
  })

  const list = Array.isArray(res?.list) ? res.list : []

  return {
    total: list.length,
    reviewing: list.filter(item => item.isCollected && !item.isReviewed).length,
    reviewed: list.filter(item => item.isCollected && item.isReviewed).length
  }
}

export function toggleReviewWordStatus(wordId) {
  return service({
    url: `/review/${wordId}/toggleStatus`,
    method: 'post'
  })
}
