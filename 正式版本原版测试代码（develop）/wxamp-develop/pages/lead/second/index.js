import api from '../../../request/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    heights: Array.from({ length: 151 }, (_, i) => 100 + i),
    // 体重范围：30kg ~ 150kg，每1公斤一个刻度
    weights: Array.from({ length: 121 }, (_, i) => 30 + i),
    heightScrollTop: 0,
    weightScrollLeft: 0,
    selectedHeight: 157, // 默认身高
    selectedWeight: 43, // 默认体重
    middleIndexHeight: 0, // 中间指示器对应的身高索引
    middleIndexWeight: 0, // 中间指示器对应的体重索引
    sign: '',
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  getInfo: function () {
    api.user.getUserInfo().then(res => {
      if (res.code == 200) {
        if(res.data.channel) {
          let channel = res.data.channel[0]

          const middleIndexHeight = channel.height*1>0?this.data.heights.indexOf(channel.height*1-13):this.data.heights.indexOf(this.data.selectedHeight);
          const middleIndexWeight = channel.weight*1>0?this.data.weights.indexOf(channel.weight*1-17):this.data.weights.indexOf(this.data.selectedWeight);
          this.setData({
            middleIndexHeight,
            middleIndexWeight,
            heightScrollTop: middleIndexHeight * 20, // 居中对齐
            weightScrollLeft: middleIndexWeight * 20, // 居中对齐
          });
        } else {
          const middleIndexHeight = this.data.heights.indexOf(this.data.selectedHeight);
          const middleIndexWeight = this.data.weights.indexOf(this.data.selectedWeight);

          this.setData({
            middleIndexHeight,
            middleIndexWeight,
            heightScrollTop: middleIndexHeight * 20, // 居中对齐
            weightScrollLeft: middleIndexWeight * 20, // 居中对齐
          });
        }
      }
    });
  },
  
  pxToRpx(px) {
    const systemInfo = wx.getSystemInfoSync();
    const screenWidth = systemInfo.screenWidth; // 屏幕宽度，单位为 px
    return px * (750 / screenWidth); // 转换为 rpx
  },

  onWeightScroll(e) {
    // console.log(e,'onWeightScroll')
    const { scrollLeft } = e.detail;
    const index = Math.round(this.pxToRpx(scrollLeft) / 20);
    const newWeight = this.data.weights[index];
    const newScrollLeft = index * 20;

    // 更新数据并自动对齐
    this.setData({
      selectedWeight: newWeight,
      weightScrollLeft: newScrollLeft,
    });
  },

  onHeightScroll(e) {
    // console.log(e,'onHeightScroll')
    const { scrollTop } = e.detail;
    const index = Math.round(this.pxToRpx(scrollTop) / 20);
    const newHeight = this.data.heights[index];
    const newScrollTop = index * 20;

    // 更新数据并自动对齐
    this.setData({
      selectedHeight: newHeight,
      heightScrollTop: newScrollTop,
    });
  },

  next() {
    let query = {
      weight: this.data.selectedWeight + 17,
      height: this.data.selectedHeight + 13
    }
    api.user.editInfo(query).then(res=>{
      if(res.code == 200) {
        wx.navigateTo({
          url: `/pages/lead/thirdly/index?sign=${this.data.sign}`
        })
      }
    }) 
    
  },

  nextto() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getInfo()
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