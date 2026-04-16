//app.js
const updateManager = wx.getUpdateManager()
import api from './request/index'
/* import * as ec from './utils/echarts.min.js';
const comp = requirePlugin('echarts');
// 设置自行引入的 echarts 依赖库
comp.echarts = ec; */

App({
  globalData: {
    globalInitialized: false,
    campSummary: null
  },
  onPageNotFound(res) {
    wx.switchTab({
      url: 'pages/index/index'
    })
  },
  onShow: function () {
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log('无新版本')
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        showCancel: false,
        content: '系统检测到当前应用版本过低,击确定重启应用',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '版本跟新失败,是否重新跟新?',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

  },
  onLaunch: function (options) {
    // console.log('小程序启动', comp.echarts.version);
    this.user_login(options)
    // this.globalData.globalInitialized = true;
  },
  async user_login(options) {
    const code = await this.get_wx_code()
    let dist = 0
    if(options.query && options.query.dist){
      dist = options.query.dist
    }

    api.common
      .loginWx({
        wxcode: code.code,
        dist: dist?dist:0
      })
      .then((r) => {
        if (r.code == 200) {
          const userInfo = { ...r.data }
          userInfo.logintime = new Date().getTime()

          wx.clearStorageSync()
          this.globalData.globalInitialized = true;
          wx.setStorageSync('userInfo', userInfo)
        }

        setTimeout(() => {
          wx.hideLoading()
        }, 500)
      })
  },
  get_wx_code() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        },
      })
    })
  },

  async refreshCampSummary() {
    try {
      const res = await api.user.myCamps({})
      if (Number(res.code) === 200) {
        const { normalizeCampData } = require('./utils/camp')
        const summary = normalizeCampData(res.data || {})
        this.globalData.campSummary = summary
        return summary
      }
    } catch (err) {
      console.log('refreshCampSummary error = ', err)
    }
  
    const empty = {
      futureCamps: [],
      currentCamps: [],
      historyCamps: [],
      hasAnyCamp: false,
      currentCount: 0,
      futureCount: 0,
      historyCount: 0,
      currentCamp: null,
      latestCamp: null
    }
  
    this.globalData.campSummary = empty
    return empty
  }

})

