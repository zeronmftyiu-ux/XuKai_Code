// pages/user/health/list.js
import api from '../../../request/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.init()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  gono() {
    wx.navigateTo({
      url: './image'
    })
  },

  init() {
    api.movewell.authInfo().then(res=>{
      if(!res.data.auth && res.data.subscribe_state) {
        wx.showToast({
          title: '请先前往华为运动健康App进行授权',
          icon: 'none',
          duration: 3000
        })
      }
      this.setData({
        auth: res.data.auth
      })
    })
  },

  config() {
    api.movewell.isAuth().then(res=>{
      this.setData({
        auth: res.data.auth
      })
    })
  },

  bind() {
    let time = new Date().getTime()
    let gid = 'U1BtaGs3eXl3dDA9_' + time
    console.log(gid)
    wx.navigateToMiniProgram({
      appId: "wxa6c04f899577d944",
      path: "pages/authLogin/authLogin",
      envVersion: "release",
      extraData: {
        lang: "zh-CN",
        // client_id: "106489783",
        client_id: "114439515", //新id
        scope: [
          "https://www.huawei.com/healthkit/step.read",
          "https://www.huawei.com/healthkit/activityrecord.read",
          "https://www.huawei.com/healthkit/hearthealth.read",
          "https://www.huawei.com/healthkit/sleep.read",
          "https://www.huawei.com/healthkit/oxygensaturation.read",
          "https://www.huawei.com/healthkit/calories.read",
          "https://www.huawei.com/healthkit/heightweight.read",
          "https://www.huawei.com/healthkit/heartrate.read",
          "https://www.huawei.com/healthkit/stress.read",
          "https://www.huawei.com/healthkit/distance.read",
          "https://www.huawei.com/healthkit/activity.read",
          "https://www.huawei.com/healthkit/location.read",
          "https://www.huawei.com/healthkit/strength.read",
          "https://www.huawei.com/healthkit/historydata.open.month",
          "https://www.huawei.com/healthkit/activehours.read",
          "https://www.huawei.com/healthkit/dailyactivitysummary.read",
        ],
        state: gid
      }
    })
  },

  goto() {
    let auth = this.data.auth
    if(auth) {
      wx.navigateTo({
        url: './index'
      });
    } else {
      this.bind()
    }  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.config()
    const enterOptions = wx.getEnterOptionsSync();
    if(enterOptions.referrerInfo && enterOptions.referrerInfo.extraData) {
      const { code, error, state } = enterOptions.referrerInfo.extraData
      console.log(enterOptions,'code')
      let arr = state.split("_");
      let nowtime = new Date().getTime()
      api.movewell.authInfo().then(res=>{
        if(!Array.isArray(arr)||arr.length < 2){
          return
        }
        if(!res.data.auth && (nowtime-arr[1]) < 60*1000) {
          api.common.loginAuth({state: state,auth_code:code,app_source:1}).then(res=>{
            this.init()
          })
        } else {
          this.init()
        }
      })
    }  
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