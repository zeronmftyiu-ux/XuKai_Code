// pages/user/health/index.js
import api from '../../../request/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        auth: "https://www.huawei.com/healthkit/distance.read",
        desc: "查看华为运动健康服务中的距离、海拔和爬高数据"
      },
      {
        auth: "https://www.huawei.com/healthkit/oxygensaturation.read",
        desc: "查看华为运动健康服务中的血氧数据"
      },
      {
        auth: "https://www.huawei.com/healthkit/activity.read",
        desc: "查看华为运动健康服务中的锻炼记录详情数据（如运动心率、速度、跑步姿势、跳绳速度、车轮转速、划水频率等）"
      },
      {
        auth: "https://www.huawei.com/healthkit/heightweight.read",
        desc: "查看华为运动健康服务中的身高和体重数据"
      },
      {
        auth: "https://www.huawei.com/healthkit/calories.read",
        desc: "查看华为运动健康服务中的热量数据(包括基础代谢)"
      },
      {
        auth: "https://www.huawei.com/healthkit/activityrecord.read",
        desc: "查看华为运动健康服务中的用户锻炼记录数据 (如跑步、骑行、跳绳等 100 + 运动类型)"
      },
      {
        auth: "https://www.huawei.com/healthkit/sleep.read",
        desc: "查看华为运动健康服务中的睡眠数据"
      },
      {
        auth: "https://www.huawei.com/healthkit/location.read",
        desc: "查看华为运动健康服务中的位置数据 (如锻炼记录轨迹)"
      },
      {
        auth: "https://www.huawei.com/healthkit/stress.read",
        desc: "查看华为运动健康服务中的压力数据"
      },
      // {
      //   auth: "https://www.huawei.com/healthkit/pulmonary.read",
      //   desc: "查看华为运动健康服务中的肺功能数据(如最大摄氧量)"
      // },
      {
        auth: "https://www.huawei.com/healthkit/heartrate.read",
        desc: "查看华为运动健康服务中的心率数据"
      },
      {
        auth: "https://www.huawei.com/healthkit/hearthealth.read",
        desc: "查看华为运动健康服务中的心脏健康相关数据 (如 ECG )"
      },
      {
        auth: "https://www.huawei.com/healthkit/step.read",
        desc: "查看华为运动健康服务中的步数数据"
      },
      {
        auth: "https://www.huawei.com/healthkit/strength.read",
        desc: "查看华为运动健康服务中的中高强度数据"
      },
      {
        auth: "https://www.huawei.com/healthkit/historydata.open.month",
        desc: "查看华为运动健康服务前一月的历史数据"
      },
      {
        auth: "https://www.huawei.com/healthkit/activehours.read",
        desc: "查看华为运动健康服务中的活动小时数数据"
      },
      {
        auth: "https://www.huawei.com/healthkit/dailyactivitysummary.read",
        desc: "查看华为运动健康服务中的日常活动数据(如活动热量，锻炼时长)"
      },
    ],
    auth: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.init();
  },

  goto() {
    wx.navigateBack()
  },

  init() {
    api.movewell.authInfo().then(res=>{
      if(res.code == 200 && res.data.auth) {
        let list = this.data.list
        let detail = res.data.detail
        list.forEach(item=>{
          let index = detail.findIndex(row=>row.auth == item.auth)
          if(index != -1) {
            item.ischeck = 1
          } else {
            item.ischeck = 0
          }
        })
        this.setData({
          auth: res.data.auth,
          list
        })
      }
    })
  },

  cencel() {
    wx.showModal({
      title: '提示',
      content: '确认取消授权？',
      success (res) {
        if (res.confirm) {
          api.movewell.cancelAuth().then(res=>{
            wx.showToast({
              title: '取消成功',
              icon: 'success',
              duration: 2000
            })
            wx.navigateBack()
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  }
})