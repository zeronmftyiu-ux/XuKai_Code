// pages/news/detail.js
import api from '../../request/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsid: null,
    current: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData(
      {
        newsid: options.id
      },
      () => {
        this.get_news_detail();
      }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  get_news_detail() {
    api.movewell.getNewsdetail({ nid: this.data.newsid }).then(r => {
      wx.stopPullDownRefresh();
      this.setData({
        current: r.data
      });
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

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