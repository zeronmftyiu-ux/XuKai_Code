function formatCampStatusText(status) {
  const map = {
    not_open: '未开始',
    ongoing: '进行中',
    ended: '已结束'
  }
  return map[status] || status || '--'
}

function normalizeCampItem(item = {}) {
  return {
    ...item,
    status_text: formatCampStatusText(item.status),
    can_enter: Number(item.can_enter) === 1
  }
}

function normalizeCampData(data = {}) {
  const futureCamps = (data.future_camps || []).map(normalizeCampItem)
  const currentCamps = (data.current_camps || []).map(normalizeCampItem)
  const historyCamps = (data.history_camps || []).map(normalizeCampItem)

  const hasAnyCamp =
    futureCamps.length > 0 ||
    currentCamps.length > 0 ||
    historyCamps.length > 0

  return {
    futureCamps,
    currentCamps,
    historyCamps,
    hasAnyCamp,
    currentCount: currentCamps.length,
    futureCount: futureCamps.length,
    historyCount: historyCamps.length,
    currentCamp: currentCamps[0] || null,
    latestCamp: currentCamps[0] || futureCamps[0] || historyCamps[0] || null
  }
}

function getBestCampEntry(campSummary = {}) {
  if (campSummary.currentCamp && campSummary.currentCamp.can_enter) {
    return {
      type: 'detail',
      campId: campSummary.currentCamp.camp_id
    }
  }

  if (campSummary.hasAnyCamp) {
    return {
      type: 'list'
    }
  }

  return {
    type: 'bind'
  }
}

module.exports = {
  formatCampStatusText,
  normalizeCampItem,
  normalizeCampData,
  getBestCampEntry
}