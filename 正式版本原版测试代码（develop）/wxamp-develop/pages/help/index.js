// pages/help/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choosetab: 0
  },
  choosetabs(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      choosetab: type
    })
  },
  godetails(e){
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/help/view?id=${id}`
    })
  },
  gofeedback(){
    wx.navigateTo({
      url: '/pages/help/feedback'
    })
  },
  gohisgfeedback(){
    wx.navigateTo({
      url: '/pages/help/hisfeback'
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