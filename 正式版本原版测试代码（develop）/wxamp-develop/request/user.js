import { request } from "./request";

const JSON_HEADER = {
  'Content-Type': 'application/json'
}

/**
 * 训练营活动列表真实后端地址
 * 这里按你当前测试环境写死。
 * 后面后端正式环境稳定后，再统一抽到配置文件。
 */
const CAMP_ACTIVITY_LIST_URL = 'http://192.168.110.5:9001/index.php?r=camp-my-activity/lists'

function getCampAuthFromStorage() {
  let userInfo = {}
  let loginInfo = {}

  try {
    userInfo = wx.getStorageSync('userInfo') || {}
  } catch (e) {}

  try {
    loginInfo = wx.getStorageSync('loginInfo') || {}
  } catch (e) {}

  const urid =
    userInfo.urid ||
    userInfo.id ||
    loginInfo.urid ||
    loginInfo.id ||
    ''

  const token =
    userInfo.token ||
    loginInfo.token ||
    ''

  return {
    urid,
    token
  }
}

function campActivityList(data = {}) {
  const auth = getCampAuthFromStorage()

  const requestData = {
    urid: data.urid || auth.urid,
    token: data.token || auth.token
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: CAMP_ACTIVITY_LIST_URL,
      method: 'POST',
      timeout: 60000,
      header: {
        'content-type': 'application/json'
      },
      data: requestData,
      success(res) {
        const responseData = (res && res.data) || {}
        resolve(responseData)
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

export default {
  getUserInfo: data => request('user/userinfo', data),
  editInfo: data => request('user/edit-user-info', data),
  getUserPointList: data => request('user/point-list', data),
  pointexpire: data => request('user/expire', data),
  getSteps: data => request('user/commituserrecord', data),
  getPoints: data => request('point/getpoint', data),
  bindAdmin: data => request('user/bind-admin', data),
  sourcelist: data => request('user/sourcelist', data),
  selectsrc: data => request('user/selectsrc', data),
  skipguide: data => request('user/skipguide', data),

  // 训练营
  myCamps: data => request('camp/mycamps', data, null, 'POST', JSON_HEADER),
  myCampsAlias: data => request('camp/my', data, null, 'POST', JSON_HEADER),
  sendRegisterVerify: data => request('sms/registerverify', data, null, 'POST', JSON_HEADER),
  bindCamp: data => request('camp/bind', data, null, 'POST', JSON_HEADER),
  campDetail: data => request('camp/detail', data, null, 'POST', JSON_HEADER),

  // 当前真实后端测试接口
  campActivityList
}