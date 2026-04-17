// pages/help/view.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choosetab: 0,
    options: {},
    imgoptions: [
      {
        url: 'http://oss.mcloud.moveclub.cn/2025/mv/doctor/%E5%A6%82%E4%BD%95%E7%BB%91%E5%AE%9A%E5%8C%BB%E7%94%9F%402x.png',
        type: 1,
        vedio: 'http://oss.mcloud.moveclub.cn/2025/mv/doctor/2%E3%80%81%E5%A6%82%E4%BD%95%E7%BB%91%E5%AE%9A%E5%8C%BB%E7%94%9F.mp4',
        name: '如何绑定专属医生？'
      },
      {
        url: 'http://oss.mcloud.moveclub.cn/2025/mv/doctor/%E5%A6%82%E4%BD%95%E6%89%8B%E5%8A%A8%E7%BB%91%E5%AE%9A%E6%89%8B%E7%8E%AF%402x.png',
        type: 2,
        vedio: 'http://oss.mcloud.moveclub.cn/2025/mv/doctor/3%E3%80%81%E5%A6%82%E4%BD%95%E7%BB%91%E5%AE%9A%E6%89%8B%E7%8E%AF.mp4',
        name: '如何手动绑定手环？'
      },
      {
        url: 'http://oss.mcloud.moveclub.cn/2025/mv/doctor/%E5%A6%82%E4%BD%95%E6%89%AB%E7%A0%81%E7%BB%91%E5%AE%9A%E6%89%8B%E7%8E%AF%402x.png',
        type: 3,
        vedio: 'http://oss.mcloud.moveclub.cn/2025/mv/doctor/3%E3%80%81%E5%A6%82%E4%BD%95%E7%BB%91%E5%AE%9A%E6%89%8B%E7%8E%AF.mp4',
        name: '如何扫码绑定手环？'
      },
      {
        url: 'http://oss.mcloud.moveclub.cn/2025/mv/doctor/%E5%A6%82%E4%BD%95%E9%A5%AE%E9%A3%9F%E6%89%93%E5%8D%A1%402x.png',
        type: 4,
        vedio: '',
        name: '如何使用小程序打卡？'
      },
      {
        url: '使用帮助',
        type: 5,
        vedio: 'http://oss.mcloud.moveclub.cn/2025/mv/doctor/3%E3%80%81%E5%A6%82%E4%BD%95%E7%BB%91%E5%AE%9A%E6%89%8B%E7%8E%AF.mp4',
        name: '使用帮助'
      },
      {
        url: '使用帮助',
        type: 6,
        vedio: 'http://oss.mcloud.moveclub.cn/2025/mv/doctor/3%E3%80%81%E5%A6%82%E4%BD%95%E7%BB%91%E5%AE%9A%E6%89%8B%E7%8E%AF.mp4',
        name: '使用帮助'
      },
      {
        url: '使用帮助',
        type: 7,
        vedio: 'http://oss.mcloud.moveclub.cn/2025/mv/doctor/3%E3%80%81%E5%A6%82%E4%BD%95%E7%BB%91%E5%AE%9A%E6%89%8B%E7%8E%AF.mp4',
        name: '使用帮助'
      },
    ],
    matchimg: '',
    matchvideo: '',
    matchname: '',
    id: '',
  },
  choosetabs(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      choosetab: type
    })
  },
  Matchimg(){
    this.data.imgoptions.forEach(i => {
      if(this.data.id == i.type){
        this.setData({
          matchimg: i.url,
          matchvideo: i.vedio,
          matchname: i.name
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.options = options;
    this.setData({
      id: options.id
    })
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
    this.Matchimg();
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