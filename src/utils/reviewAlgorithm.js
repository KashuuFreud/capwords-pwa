// 艾宾浩斯复习间隔（天）
const REVIEW_INTERVALS = [0, 1, 2, 4, 7, 15, 30, 60, 90]

// 计算下一次复习时间
export function getNextReviewTime(currentStage) {
  const now = Date.now()
  const days = REVIEW_INTERVALS[currentStage + 1] || 180
  return now + days * 24 * 60 * 60 * 1000
}

// 更新复习阶段
export function updateReviewStage(stage, remember) {
  if (remember) {
    return Math.min(stage + 1, REVIEW_INTERVALS.length - 1)
  } else {
    return Math.max(stage - 1, 0)
  }
}

// 判断是否需要今天复习
export function needReviewToday(nextReviewTime) {
  const today = new Date().setHours(0, 0, 0, 0)
  return nextReviewTime <= today
}

// 筛选今天要复习的单词
export function filterTodayReviews(wordList) {
  return wordList.filter(word => needReviewToday(word.nextReviewTime))
}