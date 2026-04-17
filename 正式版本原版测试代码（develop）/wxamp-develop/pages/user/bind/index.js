// pages/user/bind/index.js
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
    this.getUserInfo()
  },

  getUserInfo: function () {
    api.user.getUserInfo().then(res => {
      if (res.code == 200) {
        this.setData({
          userInfo: res.data
        });

      }
    });
  },

  goscan() {
    wx.scanCode({
      success (res) {
        console.log(res)
        if(res.result) {
          wx.navigateTo({
            url: './detail?bcode='+res.result
          })
        }
      }
    })
  },

  goedit() {
    wx.navigateTo({
      url: './detail'
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})