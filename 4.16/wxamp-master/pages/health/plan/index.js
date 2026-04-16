// pages/health/plan/index.js
import api from '../../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
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