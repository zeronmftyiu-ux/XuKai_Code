// pages/user/advice/index.js
import api from '../../../request/index';
import moment from "../../../utils/moment";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // option1: [
    //   { text: '类型筛选', value: 0 },
    //   // { text: '新款商品', value: 1 },
    //   // { text: '活动商品', value: 2 },
    // ],
    // option2: [
    //   { text: '医嘱日期', value: 'a' },
    //   // { text: '好评排序', value: 'b' },
    //   // { text: '销量排序', value: 'c' },
    // ],
    value1: 0,
    value2: 'a',
    list: []
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

  init() {
    // api.movewell.adviceList().then(res=>{
    //   if (res.code == 200) {
    //     res.data.forEach(item=>{
    //       item.create_time = this.formatTime(item.create_time)
    //     })
    //     this.setData({
    //       list: res.data
    //     })
    //   }
    // })
    api.doctor.exrxList().then(res=>{
      if (res.code == 200) {
        res.data.list.forEach(item=>{
          item.create_time = this.formatTime(item.create_time)
          item.date = moment(item.create_time).format('YYYY-MM-DD')
        })
        this.setData({
          list: res.data.list
        })
      }
    })
  },
  formatTime: function (timestamp) {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  },

  godetail(e) {
    let code = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: './detail?code='+code
    })
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

  }
})