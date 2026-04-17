// pages/lead/seven/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTime: 50, // 当前时间（秒）
    targetTime: 100, // 目标时间（秒）
    timer: null,
    show: true,
    sign: '',
    Isgo: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.startCountdown();
    this.options = options;
    this.setData({
      sign: options.sign?options.sign:'',
      Isgo: options.Isgo?options.Isgo:''
    })
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
          if(that.data.sign == 1){
            wx.redirectTo({
              url: '/pages/user/bind/detail'
            })
          } if(that.data.Isgo == 1){
            wx.redirectTo({
              url: '/pages/health/plan/index'
            })
          } else {
            wx.switchTab({
              url: '/pages/index/index'
            })
          }
        } else {
          let now = currentTime + Math.floor(Math.random() * 10)
          this.setData({
            currentTime: now >=100 ?  100 : now
          });
        }
      }, 400),
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