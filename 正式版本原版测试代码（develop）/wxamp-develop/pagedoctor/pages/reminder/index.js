// pagedoctor/pages/reminder/index.js
import api from '../../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    massagelist: [],
    showlist: [],
    value: '',
  },
  getmassage: function () {
    api.doctor.getMassage().then(res => {
        if (res.code == 200) {
          console.log(res.data);
          this.setData({
            massagelist: res.data,
            showlist: res.data
          });
        }
      })
  },
  onSearch(e){
    this.setData({
      value: e.detail,
    });
    this.filterAbnormalList(this.data.value);
  },
  filterAbnormalList(name) {
    const savelist = this.data.massagelist;
    let filteredList = [];
    savelist.forEach(item => {
      if (item.info.realname.includes(name)) {
        filteredList.push(item);
      }
    });
    this.setData({
      showlist: filteredList
    });
  },
  gomessage: function (e) {
    const urid = e.currentTarget.dataset.urid;
    const name = e.currentTarget.dataset.name;
    console.log(urid);
    wx.navigateTo({
      url: `/pagedoctor/pages/message/index?urid=${urid}&name=${name}`
    })
  },
  gopatient:  function (e) {
    const urid = e.currentTarget.dataset.purid;
    wx.navigateTo({
      url: `/pagedoctor/pages/patient/index?urid=${urid}`
    })
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
    this.getmassage()
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
})