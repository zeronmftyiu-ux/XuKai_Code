import moment from './moment'

const STORAGE_KEY = 'MOVEWELL_DEBUG_WEIGHT_RECORDS'

function normalizeDate(date) {
  if (!date) return moment().format('YYYY-MM-DD')
  if (typeof date === 'string' && date.length >= 10) {
    return date.slice(0, 10)
  }
  return moment(date).format('YYYY-MM-DD')
}

function buildRecord(date, weight) {
  const safeDate = normalizeDate(date)
  const value = Number(weight)

  return {
    id: `debug_${safeDate}`,
    date: safeDate,
    weight: Number(value).toFixed(2),
    datetime: moment(`${safeDate} 12:00:00`).unix(),
    create_time: moment(`${safeDate} 12:00:00`).unix(),
    update_time: safeDate,
    source: 'debug'
  }
}

export function getDebugWeightMap() {
  try {
    return wx.getStorageSync(STORAGE_KEY) || {}
  } catch (e) {
    return {}
  }
}

export function saveDebugWeightRecord({ date, weight }) {
  const safeDate = normalizeDate(date)
  const map = getDebugWeightMap()
  map[safeDate] = [buildRecord(safeDate, weight)]
  wx.setStorageSync(STORAGE_KEY, map)
  return map
}

export function clearDebugWeightMap() {
  try {
    wx.removeStorageSync(STORAGE_KEY)
  } catch (e) {}
}

export function mergeWeightMap(serverMap = {}, debugMap = getDebugWeightMap()) {
  const merged = { ...(serverMap || {}) }
  const dates = Object.keys(debugMap || {})

  dates.forEach(date => {
    merged[date] = debugMap[date]
  })

  return merged
}

export function getWeightRecordByDate(weightMap = {}, date) {
  const safeDate = normalizeDate(date)
  const list = weightMap[safeDate] || []
  if (!list.length) return null
  return list[list.length - 1]
}

export function getLatestWeightRecord(weightMap = {}) {
  const dates = Object.keys(weightMap || {}).sort()
  for (let i = dates.length - 1; i >= 0; i--) {
    const date = dates[i]
    const list = weightMap[date] || []
    if (list.length) {
      const record = list[list.length - 1]
      return {
        ...record,
        date
      }
    }
  }
  return null
}