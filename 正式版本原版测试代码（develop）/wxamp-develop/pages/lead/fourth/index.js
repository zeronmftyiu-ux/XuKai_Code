// pages/lead/fourth/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.options = options;
    this.setData({
      sign: options.sign?options.sign:'',
    })
  },

  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  next() {
    let type = this.data.radio
    switch(type) {
      case '1':
      case '3':
        wx.redirectTo({
          url: '/pages/lead/fifth/index?type='+type
        })
        break
      case '2':
        wx.redirectTo({
          url: '/pages/lead/sixth/index?type='+type
        })
        break
      case '4':
        wx.switchTab({
          url: '/pages/index/index'
        })
        break
    }
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