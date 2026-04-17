import api from '../../request/index'
import campService from '../../services/campService'
import { normalizeCampData, getBestCampEntry } from '../../utils/camp'

function getEmptyCampSummary() {
  return {
    hasAnyCamp: false,
    currentCount: 0,
    futureCount: 0,
    historyCount: 0,
    currentCamp: null,
    latestCamp: null,
    currentCamps: [],
    futureCamps: [],
    historyCamps: []
  }
}

Page({
  data: {
    userInfo: {},
    auth: false,
    expirePoint: 0,
    campSummary: getEmptyCampSummary()
  },

  onLoad() {},

  onReady() {},

  toPage() {
    wx.navigateTo({
      url: '/pages/webview/index?src=https://movewell-questionh5-develop.dev.moveclub.cn'
    })
  },

  onShow() {
    const app = getApp()

    if (app.globalData.globalInitialized) {
      this.getUserInfo()
    } else {
      const checkGlobalInitialized = () => {
        if (app.globalData.globalInitialized) {
          this.getUserInfo()
        } else {
          setTimeout(checkGlobalInitialized, 100)
        }
      }
      checkGlobalInitialized()
    }
  },

  getUserInfo() {
    api.user.getUserInfo().then(res => {
      if (res.code == 200) {
        this.setData({
          userInfo: res.data
        })
      }
    })

    this.point_expire()
    this.getCampSummary()
  },

  point_expire() {
    api.user.pointexpire().then(res => {
      if (res.code == 200) {
        this.setData({
          expirePoint: parseInt(res.data.expire || 0, 10)
        })
      }
    })
  },

  async getCampSummary() {
    const res = await campService.getCampSummary({})
    console.log('user center camp summary res = ', res)

    if (Number(res.code) === 200) {
      const summary = normalizeCampData(res.data || {})
      this.setData({
        campSummary: summary
      })
      return
    }

    this.setData({
      campSummary: getEmptyCampSummary()
    })
  },

  gopoint() {
    wx.navigateTo({
      url: '/pages/user/point/index'
    })
  },

  goAllCamp() {
    const entry = getBestCampEntry(this.data.campSummary)

    if (entry.type === 'detail' && entry.campId) {
      wx.navigateTo({
        url: `/pages/user/campDetail/index?camp_id=${entry.campId}&activity_id=${entry.campId}`
      })
      return
    }

    if (this.data.campSummary.hasAnyCamp) {
      wx.navigateTo({
        url: '/pages/user/camp/index'
      })
      return
    }

    // 绑定入口先保留现状
    wx.navigateTo({
      url: '/pages/user/campVerify/index'
    })
  },

  goCampByStatus(e) {
    const status = e.currentTarget.dataset.status
    const { campSummary } = this.data

    if (!campSummary.hasAnyCamp) {
      wx.navigateTo({
        url: '/pages/user/campVerify/index'
      })
      return
    }

    if (status === 'current') {
      const currentList = campSummary.currentCamps || []

      if (!currentList.length) {
        wx.showToast({
          title: '暂无进行中活动',
          icon: 'none'
        })
        return
      }

      const currentCamp = currentList[0]
      const activityId = currentCamp.activity_id || currentCamp.camp_id || ''

      wx.navigateTo({
        url: `/pages/user/campDetail/index?camp_id=${activityId}&activity_id=${activityId}`
      })
      return
    }

    wx.navigateTo({
      url: `/pages/user/camp/index?status=${status}`
    })
  },

  redirect(e) {
    let type = e.currentTarget.dataset.type

    switch (type * 1) {
      case 1:
        wx.navigateTo({
          url: '/pages/user/info'
        })
        break

      case 2:
        wx.navigateTo({
          url: './health/list'
        })
        break

      case 3:
        break

      case 4:
        wx.navigateTo({
          url: '/pages/webview/index?src=https://oss.mcloud.moveclub.cn/2024/movewell/MOVEWELL%E9%9A%90%E7%A7%81%E6%94%BF%E7%AD%96.html'
        })
        break

      case 8:
        wx.navigateTo({
          url: '/pages/health/plan/index'
        })
        break

      case 9:
        this.goAllCamp()
        break

      default:
        break
    }
  },

  onHide() {},

  onUnload() {},

  onPullDownRefresh() {},

  onReachBottom() {},

  onShareAppMessage() {}
})