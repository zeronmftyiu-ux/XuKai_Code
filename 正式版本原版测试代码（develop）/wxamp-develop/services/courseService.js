import api from '../request/index'
import { normalizeCourseList } from '../utils/course'

function toDateOnly(value = '') {
  if (!value) return ''
  const text = String(value)
  if (text.includes(' ')) return text.split(' ')[0]
  if (text.includes('T')) return text.split('T')[0]
  return text.slice(0, 10)
}//测试使用

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

async function getCampCourseList(params = {}) {
  try {
    const requestParams = {
      activity_id: String(params.activity_id || '1'),
      page: Number(params.page || 1),
      page_size: Number(params.page_size || 10)
    }

    const res = await api.movewell.getCampCourseList(requestParams)
    console.log('getCampCourseList raw res = ', res)
    
    const finalRes = resolveResponse(res, '课程列表加载失败')
    console.log('getCampCourseList resolved res = ', finalRes)
    
    if (Number(finalRes.code) === 200) {
      finalRes.data = normalizeCourseList(finalRes.data || {}, params)
      console.log('getCampCourseList normalized data = ', finalRes.data)
    }
    
    return finalRes
  } catch (err) {
    return {
      code: 500,
      message: '课程列表加载失败',
      data: []
    }
  }
}

async function submitCampCourseCheckin(params = {}) {
  try {
    const requestParams = {
      activity_id: String(params.activity_id || '1'),
      course_id: Number(params.course_id || 0),
      course_name_snapshot: params.course_name_snapshot || '',
      play_started_at: params.play_started_at || '',
      play_ended_at: params.play_ended_at || '',
      effective_seconds: Number(params.effective_seconds || 0),
      completion_rate: Number(params.completion_rate || 0),
      confirm_deadline_at: params.confirm_deadline_at || '',
      confirmed_at: toDateOnly(params.confirmed_at || ''),
      validation_result: params.validation_result || 'valid',
      validation_reason: params.validation_reason || ''
    }

    const res = await api.movewell.submitCampCourseCheckin(requestParams)
    return resolveResponse(res, '课程打卡提交失败')
  } catch (err) {
    return {
      code: 500,
      message: '课程打卡提交失败',
      data: {}
    }
  }
}

export default {
  getCampCourseList,
  submitCampCourseCheckin
}
