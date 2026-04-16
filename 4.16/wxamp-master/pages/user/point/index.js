// pages/record/record.js
import api from '../../../request/index'
import moment from '../../../utils/moment'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickerList:[],
    restPoint: 0,
    otherPoint: 0,
    expirePoint: 0,
    list: [],
    currentPage: 1,
    pageCount: 1
  },

  point_expire(){
    api.user.pointexpire().then((res)=>{ 
      if (res.code == 200) {
        this.setData({
          expirePoint: parseInt(res.data.expire),
        })
      }
    })
  },

  get_point_list() {
    wx.showLoading({
      title: '',
    })
    let starttime = this.getRequestData(this.data.year, this.data.month, 1)
    let endtime = this.getRequestData(this.data.year, this.data.month, new Date(this.data.year, this.data.month, 0).getDate())
    api.user
      .getUserPointList({ page: this.data.currentPage, start_time: starttime, end_time: endtime })
      .then(r => {
        wx.hideLoading()
        wx.stopPullDownRefresh();
        if (r.code == 200) {
          var list = r.data.list
          if (this.data.currentPage != 1) {
            list = this.data.list.concat(list)
          }
          list.forEach((row, i) => {
            row.time = moment(row.create_time * 1000).format('YYYY/MM/DD HH:mm:ss');
            row.value = parseInt(row.value)
          });
          this.setData({
            list: list,
            totalPoint: r.data.total_point,
            currentPage: r.data.page,
            pageCount: r.data.pages
          });
        }
      });
  },

  getRequestData(year, month, day) {
    const _formatNumber = n => {
      n = '' + n
      return n[1] ? n : '0' + n
    }
    return [year, month, day].map(_formatNumber).join('-')
  },

  getPickerData() {
    var nowdays = new Date();
    var year = nowdays.getFullYear()
    var month = nowdays.getMonth() + 1 < 10 ? '0' + (nowdays.getMonth() + 1) : nowdays.getMonth() + 1

    this.setData({
      year: year,
      month: month,
    })
  },

  bindDateChange(event) {
    console.log(event)
    let date = event.detail.value.split('-');
    this.setData({
      currentPage: 1,
      year: date[0],
      month: date[1],
    })
    this.get_point_list()
  },

  onClickUse(){
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    
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
    this.setData({
      currentPage: 1
    })
    this.point_expire()
    this.getPickerData()
    this.get_point_list();
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
  onPullDownRefresh: function() {
    this.setData({
      currentPage: 1
    })
    this.point_expire()
    this.get_point_list();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.data.currentPage++;
    if (this.data.currentPage > this.data.pageCount) {
      return
    }
    this.get_point_list();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
