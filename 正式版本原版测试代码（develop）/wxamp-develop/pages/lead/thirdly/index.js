// pages/lead/thirdly/index.js
import {calculateBMI} from "../../../utils/util";
import api from '../../../request/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    typelist: [
      {
        type: 1,
        icon: 'https://oss.mcloud.moveclub.cn/2025/mv/1%402x.png',
        name: '偏瘦',
        color: '#E5E9F1',
        min: 0,
        max: 18.4,
        lv: 18.4,
        desc: '体型偏瘦，建议营养科随诊，建议体重管理目标调整为提升身体素质。'
      },
      {
        type: 2,
        icon: 'https://oss.mcloud.moveclub.cn/2025/mv/2%402x.png',
        name: '理想',
        color: '#86E0A4',
        min: 18.5,
        max: 24.9,
        lv: 6.4,
        desc: '标准体重，进阶管理保持动吃平衡，需要提升代谢水平。'
      },
      {
        type: 3,
        icon: 'https://oss.mcloud.moveclub.cn/2025/mv/3%402x.png',
        name: '偏胖',
        color: '#FFD739',
        min: 25,
        max: 29.9,
        lv: 4.9,
        desc: '超重了，稍微努力一下，就能拥有完美体重，我们将为你定制科学方案。'
      },
      {
        type: 4,
        icon: 'https://oss.mcloud.moveclub.cn/2025/mv/4.png',
        name: '很胖',
        color: '#FF8E00',
        min: 30,
        max: 40,
        lv: 10,
        desc: '肥胖，首要任务是控制糖分，管住嘴迈开腿，健康科学减重。'
      }
    ],
    info: {},
    channel: {},
    sign: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.options = options;
    this.setData({
      sign: options.sign?options.sign:'',
    });
    this.getInfo()
  },

  getInfo: function () {
    api.user.getUserInfo().then(res => {
      if (res.code == 200) {
        this.setData({
          channel: res.data.channel.length>0?res.data.channel[0]:{}
        })   
        this.init()  
      }
    });
  },

  init() {
    let channel = this.data.channel
    
    let bmi = calculateBMI(channel.weight*1,channel.height*1)
    let typelist = this.data.typelist
    let item = {}
    if(bmi>= 40) {
      item = typelist[3]
      item.left = 545
      item.bmi = bmi
      this.setData({
        info: item
      })
    } else {
      item = typelist.find(row=> bmi <= row.max )
      item.bmi = bmi
      item.left = (item.type - 1) * 141 + Math.ceil(141/item.lv * (bmi - item.min))
      this.setData({
        info: item
      })
    }
    console.log(item)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  next() {
    if(this.data.sign == 1){
      let type = 3
      wx.redirectTo({
        url: `/pages/lead/fifth/index?type=${type}&sign=${this.data.sign}`
      })
    } else {
      wx.navigateTo({
        url: '/pages/lead/fourth/index'
      })
    }
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