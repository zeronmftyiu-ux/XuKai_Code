// pages/health/changeplan/index.js
import api from '../../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
    weightinfo: {},
  },

  getcyclelist() {
    api.movewell.mycyclelist().then(res=>{
      if (res.code == 200) {
        this.setData({
          weightinfo: res.data[0],
          tempWeightInfo: res.data[0]
        })
      }
    })
  },
  getuserinfo() {
    api.user.getUserInfo().then(res=>{
      if (res.code == 200) {
        this.setData({
          userinfo: res.data,
          tempUserInfo: res.data,
        })
      }
    })
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
    this.getuserinfo(),
    this.getcyclelist()
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

  },
})