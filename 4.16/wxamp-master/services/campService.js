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
  normalizeBindResponse
} from '../utils/camp'

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

async function getCampList(params = {}) {
  if (CAMP_USE_MOCK) {
    return Promise.resolve(getMockCampList())
  }

  try {
    const res = await api.user.myCamps(params)
    const finalRes = resolveResponse(res, '活动列表加载失败')

    if (Number(finalRes.code) === 200) {
      finalRes.data = normalizeCampSummaryResponse(finalRes.data || {})
    }

    return finalRes
  } catch (err) {
    return {
      code: 500,
      message: '活动列表加载失败',
      data: {}
    }
  }
}

async function getCampSummary(params = {}) {
  if (CAMP_USE_MOCK) {
    return Promise.resolve(getMockCampSummary())
  }

  try {
    const res = await api.user.myCamps(params)
    const finalRes = resolveResponse(res, '活动摘要加载失败')

    if (Number(finalRes.code) === 200) {
      finalRes.data = normalizeCampSummaryResponse(finalRes.data || {})
    }

    return finalRes
  } catch (err) {
    return {
      code: 500,
      message: '活动摘要加载失败',
      data: {}
    }
  }
}

async function getCampDetail(params = {}) {
  if (CAMP_USE_MOCK) {
    return Promise.resolve(getMockCampDetail(params.camp_id || params.activity_id))
  }

  try {
    const requestParams = {
      ...params,
      activity_id: params.activity_id || params.camp_id,
      camp_id: params.camp_id || params.activity_id
    }
    const res = await api.user.campDetail(requestParams)
    const finalRes = resolveResponse(res, '活动详情加载失败')

    if (Number(finalRes.code) === 200) {
      finalRes.data = normalizeCampDetail(finalRes.data || {})
    }

    return finalRes
  } catch (err) {
    return {
      code: 500,
      message: '活动详情加载失败',
      data: {}
    }
  }
}

async function sendBindCode(params = {}) {
  if (CAMP_USE_MOCK) {
    return Promise.resolve(getMockSendCode())
  }

  try {
    const requestParams = {
      ...params,
      phone: params.phone || params.mobile,
      mobile: params.mobile || params.phone
    }
    const res = await api.user.sendRegisterVerify(requestParams)
    const finalRes = resolveResponse(res, '验证码发送失败')

    if (Number(finalRes.code) === 200) {
      finalRes.data = {
        ...finalRes.data,
        mobile: finalRes.data.mobile || finalRes.data.phone || requestParams.mobile || '',
        phone: finalRes.data.phone || finalRes.data.mobile || requestParams.phone || '',
        expire_seconds: Number(finalRes.data.expire_seconds || finalRes.data.expireSeconds || 60)
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
  if (CAMP_USE_MOCK) {
    return Promise.resolve(getMockBindCamp(params))
  }

  try {
    const requestParams = {
      ...params,
      phone: params.phone || params.mobile,
      mobile: params.mobile || params.phone,
      code: params.code || params.verifycode,
      verifycode: params.verifycode || params.code
    }
    const res = await api.user.bindCamp(requestParams)
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
