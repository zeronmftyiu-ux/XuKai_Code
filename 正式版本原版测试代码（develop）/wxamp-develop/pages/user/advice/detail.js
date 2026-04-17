// pages/user/advice/detail.js
import api from '../../../request/index';
var utils = require("../../../utils/util.js");
import moment from "../../../utils/moment";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    detail: {},
    advice: {},
    info: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      code: options.code
    })
    this.init()
  },

  init() {
    // api.movewell.adviceDetail({adviceid:this.data.id}).then(res=>{
    //   if(res.code==200) {
    //     res.data.age = utils.calculateAge(res.data.birthdate)
    //     res.data.date = moment(res.data.adviceinfo.create_time * 1000).format('YYYY年MM月DD日')
    //     this.setData({
    //       detail: res.data
    //     })
    //   }
    // })
    api.doctor.exrxDetail({code:this.data.code}).then(res=>{
      if (res.code == 200) {
        res.data.exrx.create_time = moment(res.data.exrx.create_time*1000).format('YYYY-MM-DD')
        this.setData({
          detail: res.data.details[0],
          advice: res.data.exrx,
          info: res.data.params
        });
      }
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