// pages/health/plan/index.js
import api from '../../../request/index'
import moment from '../../../utils/moment'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isexpire: true,
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
    this.init()
  },

  init() {
    api.movewell.mycyclelist().then(res=>{
      if(res.code == 200) {
        res.data.forEach(item => {
          item.start = item.weight[0].weight
          item.mid = parseFloat((item.weight[0].weight*1 - item.weight[item.weight.length-1].weight*1).toFixed(2))
          item.pro = parseFloat((item.mid*100/(item.weight[0].weight*1 - item.target*1)).toFixed(2))
          item.endday = Math.floor(moment(item.endday + ' 23:59:59', 'YYYY-MM-DD HH:mm:ss').valueOf()/1000);
          console.log(item.endday)
          if (item.endday < res.sys_time) {
            item.isexpire = false; // 已过期
          } else {
            item.isexpire = true; // 未过期
          }
          if(item.pro > 100){
            item.pro = 100
          }
        });
        this.setData({
          list: res.data
        })
      }
    })
  },

  godetail(e) {
    let {id} = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/sports/trend?id='+id
    })
  },
  gochange(e) {
    wx.navigateTo({
      url: '/pages/health/changeplan/index'
    })
  },
  goplandetail(e) {
    wx.navigateTo({
      url: '/pages/health/plandetail/index'
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