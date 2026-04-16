// pages/lead/first/index.js
import {getDaysInMonth,getYearsList} from "../../../utils/util";
import api from '../../../request/index';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexlist: [
      {
        id: 1,
        name: '男性',
        nname: 'Man',
        icon: 'https://oss.mcloud.moveclub.cn/2025/mv/boy.png'
      },
      {
        id: 2,
        name: '女性',
        nname: 'Woman',
        icon: 'https://oss.mcloud.moveclub.cn/2025/mv/girl.png'
      }
    ],
    form: {
      gender: 1,
      birth: '1991-01-01'
    },
    yearlist: getYearsList(1925),
    monthlist: ['01','02','03','04','05','06','07','08','09','10','11','12'],
    daylist: getDaysInMonth(1991,'01'),
    yearindex: 66,
    monthindex: 0,
    dayindex: 0,
    year: '1991',
    month: '01',
    day: '01'
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

  getInfo: function () {
    api.user.getUserInfo().then(res => {
      if (res.code == 200) {
        if(res.data.birthday && res.data.birthday != '0000-00-00') {
          let ret = res.data.birthday.split("-");
          let daylist = getDaysInMonth(ret[0],'01')
          let form = {
            gender: res.data.gender*1,
            birth: res.data.birthday
          }
          this.setData({
            year: ret[0],
            month: ret[1],
            day: ret[2],
            yearindex: this.data.yearlist.findIndex(row=>row==ret[0]),
            monthindex: this.data.monthlist.findIndex(row=>row==ret[1]),
            dayindex: daylist.findIndex(row=>row==ret[2]),
            daylist: daylist,
            form
          })
        }
      }
    });
    api.user.skipguide({type: 1})
  },

  goback() {
    wx.navigateBack()
  },

  change(e) {
    let { id } = e.currentTarget.dataset
    this.setData({
      'form.gender': id
    })
  },

  bindYearChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      yearindex: e.detail.value,
      year: this.data.yearlist[e.detail.value],     
    })
  },

  bindMonthChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      monthindex: e.detail.value,
      month: this.data.monthlist[e.detail.value],
      daylist: getDaysInMonth(this.data.year,this.data.monthlist[e.detail.value])
    })
  },

  bindDayChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dayindex: e.detail.value,
      day: this.data.daylist[e.detail.value]
    })
  },

  next() {
    let query = Object.assign({},this.data.form)
    query.birth = this.data.year+'-'+this.data.month+'-'+this.data.day
    api.user.editInfo(query).then(res=>{
      if(res.code == 200) {
        wx.navigateTo({
          url: '/pages/lead/second/index'
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