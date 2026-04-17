// pagedoctor/pages/sign/index.js
import api from '../../../request/index'
import moment from "../../../utils/moment";
var util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 'active',
    tabs: [
      { id: 'active', name: '生效中' },
      { id: 'pending', name: '待签约' },
      { id: 'expired', name: '已过期' },
      { id: 'rejected', name: '已驳回' }
    ],
    info: [],
    value: '',
    currentPage: 1,
    totalPage: 1,
  },
  onSearch(e){
    this.setData({
      value: e.detail,
    });
    this.getMypatients();
  },
  switchTab(e) {
    // console.log('event dataset:', e.currentTarget.dataset);
    const tab = e.currentTarget.dataset.index;
    this.setData({ currentTab: tab, currentPage: 1 });
    this.getMypatients();
  },
  goeffect: function (e) {
    const urid = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pagedoctor/pages/effect/index?urid=${urid}`
    })
  },
  gopatient: function (e) {
    const urid = e.currentTarget.dataset.index;
    // const state = e.currentTarget.dataset.state;
    wx.navigateTo({
      url: `/pagedoctor/pages/patient/index?urid=${urid}`
    })
  },
  gosign: function (e) {
    const urid = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pagedoctor/pages/sign/index?urid=${urid}`
    })
  },
  goreject: function (e) {
    const urid = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pagedoctor/pages/reject/index?urid=${urid}`
    })
  },
  goexpire: function (e) {
    const urid = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pagedoctor/pages/expire/index?urid=${urid}`
    })
  },
  gorefuse: function (e){
    const urid = e.currentTarget.dataset.index;
    wx.showModal({
      title: '驳回',
      content: '确认驳回？',
      success: (res) => {
        if (res.confirm) {
          this.getEditpatient(3,urid);
          wx.showToast({ title: '已驳回' })
        }
      }
    })
  },
  gopass: function (e){
    const urid = e.currentTarget.dataset.index;
    wx.showModal({
      title: '审核通过',
      content: '确认通过？',
      success: (res) => {
        if (res.confirm) {
          this.getEditpatient(1,urid);
          wx.showToast({ title: '已通过' })

        }
      }
    })
  },
  getMypatients: function () {
    let params = {};
    params.page = this.data.currentPage;
    switch (this.data.currentTab) {
      case 'active':
        params.state = 1;
        break;
      case 'pending':
        params.state = 2;
        break;
      case 'rejected':
        params.state = 3;
        break;
      case 'expired':
        params.expired = 1;
        break;
      default:
        console.log('Unknown tab:', this.data.currentTab);
        break;
    };
    params.keyword = this.data.value;

    api.doctor.getMypatients(params).then(res => {
      if (res.code == 200) {
        res.data.list.forEach(item => {
          item.create_time = moment(item.create_time*1000).format('YYYY-MM-DD HH:mm'),
          item.expired_time =  moment(item.expired_time*1000).format('YYYY-MM-DD HH:mm'),
          // console.log(item.birthdate,util.calculateAge(item.birthdate))
          item.age = util.calculateAge(item.birthdate),
          item.sex = util.getGenderText(item.gender)
        });
        if (this.data.currentPage == 1) {
          this.setData({
            info: res.data.list,
          })
        } else {
          let infolist = [...this.data.info, ...(res.data.list || [])]
          this.setData({
            info: infolist,
          })
        }
        this.setData({
          signnum: res.data.signnum,
          waitnum: res.data.waitnum,
          totalPage: res.data.pages,
        })
      }
    });
  },
  getEditpatient: function(state,purid) {
    let params = {};
    params.state = state;
    params.purid = purid;
    api.doctor.getEditpatient(params).then(res => {
      if (res.code == 200) {
        console.log(res.data);
        this.setData({
          editpatient: res.data
        });
        this.getMypatients();
      }
    });
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getMypatients()
    // this.getEditpatient(3,12)
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
    if (this.data.currentPage >= this.data.totalPage) {
      return
    }
    this.setData({
      currentPage: this.data.currentPage + 1
    })
    this.getMypatients()
  },
})