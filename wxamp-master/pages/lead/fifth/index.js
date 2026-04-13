// pages/lead/fifth/index.js
import api from '../../../request/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weights: Array.from({ length: 201 }, (_, i) => 30 + i),
    selectedWeight: 0, // 默认体重
    weightScrollLeft: 0,
    list: ['6个月','1个月','半个月'],
    index: 0,
    typelist: [],
    type: '',
    userInfo: {},
    item: {},
    check: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      type: options.type
    })
    
    this.getInfo()
  },

  init() {
    api.movewell.cyclelist().then(res=>{
      if(res.code == 200) {
        let com = []
        let weights = Array.from({ length: 201 }, (_, i) => 30 + i)
        res.data.forEach(item=>{
          com.push(item.title)
        })
        let item = []
        let channel = this.data.userInfo.channel?this.data.userInfo.channel[0]:{}
        
        let selectedWeight = channel.weight*1>0?(Math.floor(channel.weight*1) - 17): 38
        let weight = selectedWeight + 17
        let check = this.data.check
        item = res.data[0]
        if(weight - channel.weight*1 > 0) {
          item.lweight = ((weight - channel.weight*1)/item.week).toFixed(2)
          check = 1
        } else {
          item.lweight = ((channel.weight - weight*1)/item.week).toFixed(2)
          check = 2
        }
        weights = Array.from({ length: Math.floor(item.safe_high)+1 }, (_, i) => Math.floor(item.safe_low) + i)

        const middleIndexWeight = channel.weight*1>0?weights.indexOf(channel.weight*1-17):weights.indexOf(38);
        const weightScrollLeft = middleIndexWeight * 20
        this.setData({
          typelist: res.data,
          list: com,
          weights:weights,
          item,
          check,
          weightScrollLeft: weightScrollLeft
        })
      }
      
    })
  },
  getInfo: function () {
      api.user.getUserInfo().then(res => {
        if (res.code == 200) {
          this.setData({
            userInfo: res.data
          })  
          this.init()   
        }
      });
  },

  pxToRpx(px) {
    const systemInfo = wx.getSystemInfoSync();
    const screenWidth = systemInfo.screenWidth; // 屏幕宽度，单位为 px
    return px * (750 / screenWidth); // 转换为 rpx
  },

  onWeightScroll(e) {
    const { scrollLeft } = e.detail;
    const index = Math.round(this.pxToRpx(scrollLeft) / 20);
    const newWeight = this.data.weights[index];
    const newScrollLeft = index * 20;
    let channel = this.data.userInfo.channel?this.data.userInfo.channel[0]:{}
    let weight = this.data.weights[index] + 17
    let check = this.data.check
    let item = this.data.item
    if(weight - channel.weight*1 > 0) {
      item.lweight = ((weight - channel.weight*1)/item.week).toFixed(2)
      check = 1
    } else {
      item.lweight = ((channel.weight*1 - weight)/item.week).toFixed(2)
      check = 2
    }
    this.setData({
      selectedWeight: newWeight,
      weightScrollLeft: newScrollLeft,
      check,
      item
    });
  },

  bindChange: function(e) {
    let typelist = this.data.typelist
    let channel = this.data.userInfo.channel?this.data.userInfo.channel[0]:{}
    let weight = this.data.selectedWeight + 17
    let check = this.data.check
    let item = typelist[e.detail.value]
    if(weight - channel.weight*1 > 0) {
      item.lweight = ((weight - channel.weight*1)/item.week).toFixed(2)
      check = 1
    } else {
      item.lweight = ((channel.weight*1 - weight)/item.week).toFixed(2)
      check = 2
    }
    // let weight = Array.from({ length: Math.floor(item.safe_high) - 8 }, (_, i) => (Math.floor(item.safe_low) - 17) + i)
    this.setData({
      index: e.detail.value,
      item: item,
      check
      // weights: weight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  next() {
    let type = this.data.type
    let userInfo = this.data.userInfo
    let query = {
      cycleid: this.data.item.id,
      target: this.data.selectedWeight + 17
    }
    api.movewell.setCycle(query).then(res=>{
      if(res.code == 200) {
        api.movewell.generatecycle({cycleid: res.data.cycleid})
        if(userInfo.guide.question == 0) {
          wx.navigateTo({
            url: '/pages/lead/sixth/index?type='+type
          })
        }
        
      }
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