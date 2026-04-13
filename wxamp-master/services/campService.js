import api from '../request/index'
import { CAMP_USE_MOCK } from '../utils/mock'
import {
  getMockCampList,
  getMockCampSummary,
  getMockCampDetail,
  getMockSendCode,
  getMockBindCamp
} from '../mock/camp'

function resolveResponse(res, fallbackMessage = '请求失败') {
  if (res && Number(res.code) === 200) {
    return res
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
    return resolveResponse(res, '活动列表加载失败')
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
    return resolveResponse(res, '活动摘要加载失败')
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
    return Promise.resolve(getMockCampDetail(params.camp_id))
  }

  try {
    const res = await api.user.campDetail(params)
    return resolveResponse(res, '活动详情加载失败')
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
    const res = await api.user.sendRegisterVerify(params)
    return resolveResponse(res, '验证码发送失败')
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
    const res = await api.user.bindCamp(params)
    return resolveResponse(res, '绑定失败')
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