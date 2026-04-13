// pages/lead/seven/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime: 20, // 当前时间（秒）
    targetTime: 100, // 目标时间（秒）
    timer: null,
    show: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.startCountdown();
  },

  onclose() {
    this.setData({
      show: false
    })
  },

  startCountdown() {
    // 启动定时器
    let that = this
    this.setData({
      timer: setInterval(() => {
        const { currentTime, targetTime } = this.data;

        if (currentTime >= targetTime) {
          // 如果达到目标时间，清除定时器
          clearInterval(this.data.timer);
          // wx.showToast({
          //   title: '时间到！',
          //   icon: 'success',
          // });
          that.setData({
            show: false
          })
          wx.switchTab({
            url: '/pages/index/index'
          })
        } else {
          // 每次累加 1 秒
          let now = currentTime + Math.floor(Math.random() * 10)
          this.setData({
            currentTime: now >=100 ?  100 : now
          });
        }
      }, 1000), // 每隔 1 秒执行一次
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
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
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