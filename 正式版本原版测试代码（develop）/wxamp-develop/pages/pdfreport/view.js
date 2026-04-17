// pages/pdfreport/view.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pdfUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      pdfUrl: options.url,
    })
    this.openDocument(options.url);
  },

  /**
   * 使用微信API打开PDF文档
   */
  openDocument(url) {
    wx.downloadFile({
      url: url,
      success: function (res) {
        const filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
          fileType: 'pdf',
          success: function (res) {
            console.log('打开文档成功');
          },
          fail: function (err) {
            console.error('打开文档失败', err);
            wx.showToast({
              title: '打开文档失败',
              icon: 'none'
            });
          }
        });
      },
      fail: function (err) {
        console.error('下载文档失败', err);
        wx.showToast({
          title: '下载文档失败',
          icon: 'none'
        });
      }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})