// pagedoctor/pages/abnormal/index.js
import api from '../../../request/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    abnormalList: [],
    savelist: [],
    value: '',
    show: false,
  },
  onSearch(e){
    this.setData({
      value: e.detail,
    });
    this.filterAbnormalList(this.data.value);
  },
  filterAbnormalList(name) {
    const { savelist } = this.data; //解构赋值
    let filteredList = [];
    savelist.forEach(item => {
      if (item.info.realname.includes(name)) {
        filteredList.push(item);
      }
    });
    this.setData({
      abnormalList: filteredList
    });
  },
  gomessage: function (e) {
    const urid = e.currentTarget.dataset.index;
    this.getAlertchat(urid)
    wx.navigateTo({
      url: `/pagedoctor/pages/message/index?urid=${urid}`
    })
  },
  gopatient: function (e) {
    const urid = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pagedoctor/pages/patient/index?urid=${urid}`
    })
  },
  getabnormal: function () {
    api.doctor.getAbnormal().then(res => {
      if (res.code == 200) {
        this.setData({
          abnormalList: res.data,
          savelist: res.data
        });
      }
    });
  },
  getAlertchat: function (uid) {
    const urid = uid
    api.doctor.getAlertchat({purid:urid}).then(res => {
      if (res.code == 200) {
        console.log(res.data);
        this.setData({
          alertchat: res.data
        });
      }
    });
  },
  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  onChange(e) {
    this.setData({
      result: e.detail,
    });
  },
  // 点击批量处理唤起pop层，在复选框将选中的urid存在allurid中，点击确定后调用getAlertchat接口，返回成功后提示‘批量处理成功’
  alldeal(){
    
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
    this.getabnormal();
    // this.getAlertchat()
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