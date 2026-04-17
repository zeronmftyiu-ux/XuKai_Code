// pages/news/index.js
var pararms = require("../../utils/params.js");
var utils = require("../../utils/util.js");
import moment from "../../utils/moment";
import api from '../../request/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newlist: [],
    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getNews()
  },
  getNews() {
    var data = {
      page: this.data.page,
    }
    wx.showLoading({
      title: '加载中',
    })
    api.movewell.getNewsData(data).then(r => {
      if (r.code == 200) {
        wx.hideLoading()
        r.data.list.forEach(item => {
          item.create_time = moment(Number(item.create_time) * 1000).format('YYYY-MM-DD HH:mm:ss')
        })
        // 选择前10个数据
        this.setData({
          newlist: this.data.newlist.concat(r.data.list),
        })
      }
    })
  },

  go_news_detail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './detail?id=' + id
    });
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
    this.setData({
      page: this.data.page + 1
    })
    this.getNews()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})