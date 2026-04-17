import api from '../request/index'
import { CAMP_USE_MOCK } from '../utils/mock'
import {
  getMockCampList,
  getMockCampSummary,
  getMockCampDetail,
  getMockSendCode,
  getMockBindCamp
} from '../mock/camp'
import {
  normalizeCampSummaryResponse,
  normalizeCampDetail,
  normalizeBindResponse,
  normalizeCampItem
} from '../utils/camp'

const CAMP_LIST_CACHE_KEY = 'CAMP_ACTIVITY_LIST_CACHE_V1'

function resolveResponse(res, fallbackMessage = '请求失败') {
  if (res && Number(res.code) === 200) {
    return {
      ...res,
      message: res.message || '成功',
      data: res.data || {}
    }
  }

  return {
    code: res && res.code ? res.code : 500,
    message: (res && res.message) || fallbackMessage,
    data: (res && res.data) || {}
  }
}

function setCampListCache(list = []) {
  try {
    wx.setStorageSync(CAMP_LIST_CACHE_KEY, list)
  } catch (e) {}
}

function getCampListCache() {
  try {
    const list = wx.getStorageSync(CAMP_LIST_CACHE_KEY)
    return Array.isArray(list) ? list : []
  } catch (e) {
    return []
  }
}

function buildDefaultTaskList() {
  return [
    {
      key: 'motion',
      title: '每日运动',
      desc: '完成运动课程或运动打卡',
      url: '/pages/motion/course/index'
    },
    {
      key: 'food',
      title: '每日饮食',
      desc: '记录每日饮食情况',
      url: '/pages/food/index'
    },
    {
      key: 'point',
      title: '积分明细',
      desc: '查看当前积分与获取记录',
      url: '/pages/user/point/index'
    },
    {
      key: 'news',
      title: '推荐阅读',
      desc: '查看活动健康资讯',
      url: '/pages/news/index'
    }
  ]
}

function getStageTextByType(activityType = '') {
  const map = {
    fat_loss: '减脂习惯养成期',
    shape: '塑形提升期',
    health: '健康管理期',
    weight: '体重管理期',
    running: '耐力提升期',
    posture: '体态调整期'
  }
  return map[activityType] || '习惯养成期'
}

function getTodayTaskListByType(activityType = '') {
  const map = {
    fat_loss: ['完成课程跟练 1 次', '午休后步行 15 分钟', '晚餐后记录饮食 1 次'],
    shape: ['完成核心训练 1 次', '记录全天饮食 1 次', '晚间拉伸 15 分钟'],
    health: ['记录早餐 1 次', '完成日常步数目标', '饮水打卡 1 次'],
    weight: ['完成体重记录 1 次', '记录全天饮食 1 次', '步行 20 分钟'],
    running: ['完成快走/慢跑 1 次', '记录饮食 1 次', '饮水打卡 1 次'],
    posture: ['完成拉伸课程 1 次', '记录饮食 1 次', '晚间放松 10 分钟']
  }

  return map[activityType] || ['完成课程跟练 1 次', '记录饮食 1 次', '饮水打卡 1 次']
}

function buildFallbackDetailByListItem(item = {}) {
  const normalized = normalizeCampItem(item)
  const startAt = normalized.activity_start_at || ''
  const now = Date.now()
  const startMs = startAt ? new Date(startAt).getTime() : NaN

  let currentDay = 1
  if (!Number.isNaN(startMs) && now > startMs) {
    currentDay = Math.max(1, Math.floor((now - startMs) / (24 * 60 * 60 * 1000)) + 1)
  }

  return {
    ...item,
    activity_id: normalized.activity_id,
    activity_name: normalized.activity_name,
    activity_type: normalized.activity_type,
    activity_start_at: normalized.activity_start_at,
    activity_end_at: normalized.activity_end_at,
    status: normalized.status,
    group_id: normalized.group_id,
    group_name: normalized.group_name,
    company_name: normalized.company_name,
    taskList: buildDefaultTaskList(),
    dashboard: {
      stage_text: getStageTextByType(normalized.activity_type),
      current_day: currentDay,
      remain_task_text: '今天还差 1 次课程打卡，完成后可累计本周进度。',
      today_task_list: getTodayTaskListByType(normalized.activity_type),
      current_weight: '--',
      lost_weight: '--',
      distance_weight: '--',
      week_done: 0,
      week_total: 0,
      progress_percent: 0
    }
  }
}

async function fetchRealCampList(params = {}) {
  const res = await api.user.campActivityList(params)
  const finalRes = resolveResponse(res, '活动列表加载失败')

  if (Number(finalRes.code) === 200) {
    const normalizedData = normalizeCampSummaryResponse(finalRes.data || {})
    const cachedList = [
      ...(normalizedData.current_camps || []),
      ...(normalizedData.future_camps || []),
      ...(normalizedData.history_camps || [])
    ]
    setCampListCache(cachedList)
    finalRes.data = normalizedData
  }

  return finalRes
}

async function getCampList(params = {}) {
  try {
    if (CAMP_USE_MOCK) {
      const res = await getMockCampList()
      const finalRes = resolveResponse(res, '活动列表加载失败')
      if (Number(finalRes.code) === 200) {
        finalRes.data = normalizeCampSummaryResponse(finalRes.data || {})
      }
      return finalRes
    }

    return await fetchRealCampList(params)
  } catch (err) {
    return {
      code: 500,
      message: '活动列表加载失败',
      data: {}
    }
  }
}

async function getCampSummary(params = {}) {
  try {
    if (CAMP_USE_MOCK) {
      const res = await getMockCampSummary()
      const finalRes = resolveResponse(res, '活动摘要加载失败')
      if (Number(finalRes.code) === 200) {
        finalRes.data = normalizeCampSummaryResponse(finalRes.data || {})
      }
      return finalRes
    }

    return await fetchRealCampList(params)
  } catch (err) {
    return {
      code: 500,
      message: '活动摘要加载失败',
      data: {}
    }
  }
}

async function getCampDetail(params = {}) {
  try {
    const activityId = String(params.activity_id || params.camp_id || '')

    if (!activityId) {
      return {
        code: 500,
        message: '活动ID缺失',
        data: {}
      }
    }

    if (CAMP_USE_MOCK) {
      const res = await getMockCampDetail(activityId)
      const finalRes = resolveResponse(res, '活动详情加载失败')

      if (Number(finalRes.code) === 200) {
        finalRes.data = normalizeCampDetail(finalRes.data || {})
      }

      return finalRes
    }

    const cachedList = getCampListCache()
    const matched = cachedList.find(
      item => String(item.activity_id || item.camp_id || item.activityId || '') === activityId
    )

    if (!matched) {
      const listRes = await fetchRealCampList(params)
      if (Number(listRes.code) !== 200) {
        return {
          code: 500,
          message: '活动详情加载失败',
          data: {}
        }
      }

      const latestList = getCampListCache()
      const latestMatched = latestList.find(
        item => String(item.activity_id || item.camp_id || item.activityId || '') === activityId
      )

      if (!latestMatched) {
        return {
          code: 404,
          message: '未找到活动详情',
          data: {}
        }
      }

      return {
        code: 200,
        message: '成功',
        data: normalizeCampDetail(buildFallbackDetailByListItem(latestMatched))
      }
    }

    return {
      code: 200,
      message: '成功',
      data: normalizeCampDetail(buildFallbackDetailByListItem(matched))
    }
  } catch (err) {
    return {
      code: 500,
      message: '活动详情加载失败',
      data: {}
    }
  }
}

async function sendBindCode(params = {}) {
  try {
    const requestParams = {
      ...params,
      phone: params.phone || params.mobile || ''
    }

    const res = CAMP_USE_MOCK
      ? await getMockSendCode()
      : await api.user.sendRegisterVerify(requestParams)

    const finalRes = resolveResponse(res, '验证码发送失败')

    if (Number(finalRes.code) === 200) {
      finalRes.data = {
        ...finalRes.data,
        phone: finalRes.data.phone || requestParams.phone || '',
        mobile: finalRes.data.mobile || finalRes.data.phone || requestParams.phone || '',
        expire_seconds: Number(finalRes.data.expire_seconds || 60)
      }
    }

    return finalRes
  } catch (err) {
    return {
      code: 500,
      message: '验证码发送失败',
      data: {}
    }
  }
}

async function bindCamp(params = {}) {
  try {
    const requestParams = {
      ...params,
      phone: params.phone || params.mobile || '',
      code: params.code || params.verifycode || ''
    }

    const res = CAMP_USE_MOCK
      ? await getMockBindCamp(requestParams)
      : await api.user.bindCamp({
          ...requestParams,
          mobile: requestParams.phone,
          verifycode: requestParams.code
        })

    const finalRes = resolveResponse(res, '绑定失败')

    if (Number(finalRes.code) === 200) {
      finalRes.data = normalizeBindResponse(finalRes.data || {})
    }

    return finalRes
  } catch (err) {
    return {
      code: 500,
      message: '绑定失败',
      data: {}
    }
  }
}

export default {
  getCampList,
  getCampSummary,
  getCampDetail,
  sendBindCode,
  bindCamp
}